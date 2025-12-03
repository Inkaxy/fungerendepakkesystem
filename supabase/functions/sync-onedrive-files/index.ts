import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncRequest {
  bakery_id?: string
  setting_id?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  })

  try {
    let bakeryId: string | undefined
    let settingId: string | undefined

    // Parse request body if present
    if (req.method === 'POST') {
      try {
        const body: SyncRequest = await req.json()
        bakeryId = body.bakery_id
        settingId = body.setting_id
      } catch {
        // No body or invalid JSON - will sync all
      }
    }

    console.log('Starting sync:', { bakeryId, settingId })

    // Get bakeries to sync
    let query = supabase
      .from('file_sync_settings')
      .select(`
        id,
        bakery_id,
        folder_path,
        bakery_onedrive_connections!inner (
          access_token_encrypted,
          refresh_token_encrypted,
          token_expires_at,
          is_connected
        )
      `)
      .eq('is_active', true)
      .eq('service_type', 'onedrive')

    if (bakeryId) {
      query = query.eq('bakery_id', bakeryId)
    }
    if (settingId) {
      query = query.eq('id', settingId)
    }

    const { data: settings, error: settingsError } = await query

    if (settingsError) {
      console.error('Error fetching settings:', settingsError)
      return new Response(JSON.stringify({ error: 'Kunne ikke hente innstillinger' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!settings || settings.length === 0) {
      console.log('No bakeries to sync')
      return new Response(JSON.stringify({ message: 'Ingen bakerier å synkronisere' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const results = []

    for (const setting of settings) {
      const connection = (setting as any).bakery_onedrive_connections
      if (!connection?.is_connected || !connection?.access_token_encrypted) {
        console.log(`Skipping bakery ${setting.bakery_id}: not connected`)
        continue
      }

      // Create sync log
      const { data: syncLog, error: logError } = await supabase
        .from('file_sync_logs')
        .insert({
          bakery_id: setting.bakery_id,
          sync_setting_id: setting.id,
          status: 'in_progress',
        })
        .select()
        .single()

      if (logError) {
        console.error('Error creating sync log:', logError)
        continue
      }

      try {
        // Check if token needs refresh
        let accessToken = connection.access_token_encrypted
        if (new Date(connection.token_expires_at) < new Date()) {
          console.log('Token expired, refreshing...')
          accessToken = await refreshToken(supabase, setting.bakery_id, connection.refresh_token_encrypted)
        }

        // Fetch files from OneDrive
        const folderPath = setting.folder_path || '/Pakkesystem'
        const files = await fetchOneDriveFiles(accessToken, folderPath)
        
        console.log(`Found ${files.length} files in ${folderPath}`)

        // Filter relevant files
        const relevantFiles = files.filter((f: any) => {
          const name = f.name.toLowerCase()
          return name.endsWith('.prd') || name.endsWith('.cus') || name.endsWith('.od0')
        })

        console.log(`${relevantFiles.length} relevant files to process`)

        let filesProcessed = 0
        let filesFailed = 0
        const fileDetails: any[] = []

        // Sort files: .prd first, then .cus, then .od0
        const sortedFiles = relevantFiles.sort((a: any, b: any) => {
          const order = { '.prd': 0, '.cus': 1, '.od0': 2 }
          const aExt = a.name.toLowerCase().slice(-4)
          const bExt = b.name.toLowerCase().slice(-4)
          return (order[aExt as keyof typeof order] ?? 99) - (order[bExt as keyof typeof order] ?? 99)
        })

        for (const file of sortedFiles) {
          try {
            // Download file content
            const content = await downloadOneDriveFile(accessToken, file.id)
            
            // Process based on file type
            const ext = file.name.toLowerCase().slice(-4)
            let result = { products: 0, customers: 0, orders: 0 }

            if (ext === '.prd') {
              result.products = await processProductFile(supabase, setting.bakery_id, content)
            } else if (ext === '.cus') {
              result.customers = await processCustomerFile(supabase, setting.bakery_id, content)
            } else if (ext === '.od0') {
              result.orders = await processOrderFile(supabase, setting.bakery_id, content)
            }

            fileDetails.push({
              name: file.name,
              status: 'success',
              ...result,
            })
            filesProcessed++
          } catch (fileError) {
            console.error(`Error processing file ${file.name}:`, fileError)
            fileDetails.push({
              name: file.name,
              status: 'error',
              error: String(fileError),
            })
            filesFailed++
          }
        }

        // Update sync log with results
        await supabase
          .from('file_sync_logs')
          .update({
            status: filesFailed === 0 ? 'success' : 'partial',
            files_found: relevantFiles.length,
            files_processed: filesProcessed,
            files_failed: filesFailed,
            file_details: fileDetails,
            sync_completed_at: new Date().toISOString(),
          })
          .eq('id', syncLog.id)

        // Update last sync status
        await supabase
          .from('file_sync_settings')
          .update({
            last_sync_at: new Date().toISOString(),
            last_sync_status: filesFailed === 0 ? 'success' : 'partial',
            last_sync_error: null,
          })
          .eq('id', setting.id)

        results.push({
          bakery_id: setting.bakery_id,
          status: 'success',
          files_processed: filesProcessed,
          files_failed: filesFailed,
        })

      } catch (syncError) {
        console.error(`Sync error for bakery ${setting.bakery_id}:`, syncError)

        await supabase
          .from('file_sync_logs')
          .update({
            status: 'error',
            error_message: String(syncError),
            sync_completed_at: new Date().toISOString(),
          })
          .eq('id', syncLog.id)

        await supabase
          .from('file_sync_settings')
          .update({
            last_sync_at: new Date().toISOString(),
            last_sync_status: 'error',
            last_sync_error: String(syncError),
          })
          .eq('id', setting.id)

        results.push({
          bakery_id: setting.bakery_id,
          status: 'error',
          error: String(syncError),
        })
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function refreshToken(supabase: any, bakeryId: string, refreshToken: string): Promise<string> {
  const clientId = Deno.env.get('MICROSOFT_CLIENT_ID')!
  const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET')!

  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: 'Files.Read User.Read offline_access',
    }),
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  const tokens = await response.json()
  const tokenExpiresAt = new Date(Date.now() + (tokens.expires_in * 1000)).toISOString()

  // Update tokens in database
  await supabase
    .from('bakery_onedrive_connections')
    .update({
      access_token_encrypted: tokens.access_token,
      refresh_token_encrypted: tokens.refresh_token || refreshToken,
      token_expires_at: tokenExpiresAt,
      last_token_refresh: new Date().toISOString(),
    })
    .eq('bakery_id', bakeryId)

  return tokens.access_token
}

async function fetchOneDriveFiles(accessToken: string, folderPath: string): Promise<any[]> {
  // Encode the folder path for the API
  const encodedPath = encodeURIComponent(folderPath.replace(/^\//, ''))
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodedPath}:/children`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    if (response.status === 404) {
      console.log('Folder not found, returning empty array')
      return []
    }
    throw new Error(`OneDrive API error: ${response.status}`)
  }

  const data = await response.json()
  return data.value || []
}

async function downloadOneDriveFile(accessToken: string, fileId: string): Promise<string> {
  const url = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`)
  }

  return await response.text()
}

async function processProductFile(supabase: any, bakeryId: string, content: string): Promise<number> {
  const lines = content.split('\n').filter(line => line.trim())
  let count = 0

  for (const line of lines) {
    try {
      const parts = line.trim().split(/\s+/)
      if (parts.length < 2) continue

      const productNumber = parts[0]
      const name = parts.slice(1).join(' ').replace(/\d{13}.*$/, '').trim()

      if (!name) continue

      const { error } = await supabase
        .from('products')
        .upsert({
          bakery_id: bakeryId,
          product_number: productNumber,
          name,
          is_active: true,
        }, {
          onConflict: 'bakery_id,product_number',
          ignoreDuplicates: false,
        })

      if (!error) count++
    } catch (e) {
      console.error('Error parsing product line:', e)
    }
  }

  return count
}

async function processCustomerFile(supabase: any, bakeryId: string, content: string): Promise<number> {
  const lines = content.split('\n').filter(line => line.trim())
  let count = 0

  for (const line of lines) {
    try {
      // Try labeled format first
      const labeledMatch = line.match(/kundenummer:\s*(\d+).*?Kundenanv:\s*([^,]+)/i)
      
      let customerNumber: string
      let name: string

      if (labeledMatch) {
        customerNumber = labeledMatch[1].replace(/^0+/, '') || '0'
        name = labeledMatch[2].trim()
      } else {
        // Standard format: number name
        const parts = line.trim().split(/\s{2,}/)
        if (parts.length < 2) continue
        customerNumber = parts[0].replace(/^0+/, '') || '0'
        name = parts[1].trim()
      }

      if (!name) continue

      const { error } = await supabase
        .from('customers')
        .upsert({
          bakery_id: bakeryId,
          customer_number: customerNumber,
          name,
          status: 'active',
        }, {
          onConflict: 'bakery_id,customer_number',
          ignoreDuplicates: false,
        })

      if (!error) count++
    } catch (e) {
      console.error('Error parsing customer line:', e)
    }
  }

  return count
}

async function processOrderFile(supabase: any, bakeryId: string, content: string): Promise<number> {
  const lines = content.split('\n').filter(line => line.trim())
  let count = 0

  // First, build maps for products and customers
  const { data: products } = await supabase
    .from('products')
    .select('id, product_number')
    .eq('bakery_id', bakeryId)

  const { data: customers } = await supabase
    .from('customers')
    .select('id, customer_number')
    .eq('bakery_id', bakeryId)

  const productMap = new Map(products?.map((p: any) => [p.product_number, p.id]) || [])
  const customerMap = new Map(customers?.map((c: any) => [c.customer_number, c.id]) || [])

  // Group orders by customer and date
  const orderGroups = new Map<string, { customerId: string; date: string; products: { productId: string; quantity: number }[] }>()

  for (const line of lines) {
    try {
      const parts = line.trim().split(/\s+/)
      if (parts.length < 4) continue

      const productNumber = parts[0]
      const compositeField = parts[1]
      const dateStr = parts[3]

      // Parse composite field: first digits are customer number, last 4 are quantity
      const customerNumber = compositeField.slice(0, -4).replace(/^0+/, '') || '0'
      const quantity = parseInt(compositeField.slice(-4), 10)

      // Parse date (DDMMYY format)
      const day = dateStr.slice(0, 2)
      const month = dateStr.slice(2, 4)
      const year = '20' + dateStr.slice(4, 6)
      const deliveryDate = `${year}-${month}-${day}`

      const productId = productMap.get(productNumber)
      const customerId = customerMap.get(customerNumber)

      if (!productId || !customerId || quantity <= 0) continue

      const key = `${customerId}-${deliveryDate}`
      if (!orderGroups.has(key)) {
        orderGroups.set(key, { customerId, date: deliveryDate, products: [] })
      }
      orderGroups.get(key)!.products.push({ productId, quantity })

    } catch (e) {
      console.error('Error parsing order line:', e)
    }
  }

  // Create orders
  for (const [key, group] of orderGroups) {
    try {
      // Check if order already exists
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('bakery_id', bakeryId)
        .eq('customer_id', group.customerId)
        .eq('delivery_date', group.date)
        .single()

      if (existing) {
        console.log(`Order already exists for customer ${group.customerId} on ${group.date}`)
        continue
      }

      // Create order
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          bakery_id: bakeryId,
          customer_id: group.customerId,
          delivery_date: group.date,
          order_number: orderNumber,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        continue
      }

      // Create order products
      const orderProducts = group.products.map(p => ({
        order_id: order.id,
        bakery_id: bakeryId,
        product_id: p.productId,
        quantity: p.quantity,
        packing_status: 'pending',
      }))

      const { error: productsError } = await supabase
        .from('order_products')
        .insert(orderProducts)

      if (!productsError) count++

    } catch (e) {
      console.error('Error creating order:', e)
    }
  }

  return count
}

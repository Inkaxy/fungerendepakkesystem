import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// File parsers (simplified versions of frontend parsers)
function removeLeadingZeros(str: string): string {
  const result = str.replace(/^0+/, '');
  return result || '0';
}

interface ParsedProduct {
  original_id: string;
  product_number: string;
  name: string;
  category: string;
  is_active: boolean;
  bakery_id: string;
}

interface ParsedCustomer {
  original_id: string;
  customer_number: string;
  name: string;
  address?: string;
  phone?: string;
  status: string;
  bakery_id: string;
}

interface ParsedOrder {
  order_number: string;
  delivery_date: string;
  status: string;
  customer_id: string;
  bakery_id: string;
  order_products: { product_original_id: string; quantity: number; packing_status: string }[];
}

function parseProductFile(content: string, bakeryId: string): ParsedProduct[] {
  const lines = content.split('\n').filter(line => line.trim());
  const products: ParsedProduct[] = [];
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;
    
    const productNumber = parts[0];
    let nameEndIndex = parts.length;
    for (let j = 1; j < parts.length; j++) {
      if (/^\d{4,}/.test(parts[j])) {
        nameEndIndex = j;
        break;
      }
    }
    
    const productName = parts.slice(1, nameEndIndex).join(' ');
    if (!productName) continue;
    
    products.push({
      original_id: productNumber,
      product_number: productNumber,
      name: productName,
      category: 'Imported',
      is_active: true,
      bakery_id: bakeryId
    });
  }
  
  return products;
}

function parseCustomerFile(content: string, bakeryId: string): ParsedCustomer[] {
  const lines = content.split('\n').filter(line => line.trim());
  const customers: ParsedCustomer[] = [];
  
  for (const line of lines) {
    let originalId: string;
    let processedId: string;
    let name: string;
    let address = '';
    let phone = '';
    
    if (line.includes('kundenummer:') || line.includes('Kundenanv:')) {
      const idMatch = line.match(/kundenummer:\s*(\d+)/i);
      const nameMatch = line.match(/Kundenanv:\s*([^A-Z]+?)(?:\s+[A-Z][a-z]+:|$)/);
      const addrMatch = line.match(/Adresse:\s*([^T]+?)(?:\s+Tlf:|$)/);
      const phoneMatch = line.match(/Tlf:\s*(\d+)/);
      
      if (!idMatch || !nameMatch) continue;
      
      originalId = idMatch[1];
      processedId = removeLeadingZeros(originalId);
      name = nameMatch[1].trim();
      address = addrMatch ? addrMatch[1].trim() : '';
      phone = phoneMatch ? phoneMatch[1] : '';
    } else {
      const parts = line.split(/\s{4,}/);
      if (parts.length < 2) continue;
      
      originalId = parts[0];
      processedId = removeLeadingZeros(originalId);
      name = parts[1];
      address = parts[2] || '';
    }
    
    if (!name) continue;
    
    customers.push({
      original_id: originalId,
      customer_number: processedId,
      name,
      address: address || undefined,
      phone: phone || undefined,
      status: 'active',
      bakery_id: bakeryId
    });
  }
  
  return customers;
}

function parseOrderFile(content: string, bakeryId: string): ParsedOrder[] {
  const lines = content.split('\n').filter(line => line.trim());
  const orderGroups = new Map<string, ParsedOrder>();
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5) continue;
    
    try {
      const productId = removeLeadingZeros(parts[0]);
      const compositeField = parts[1];
      
      if (compositeField.length < 9) continue;
      
      const withoutPrefix = compositeField.substring(4);
      if (withoutPrefix.length < 5) continue;
      
      const quantityPart = withoutPrefix.slice(-5);
      const quantity = parseInt(removeLeadingZeros(quantityPart), 10);
      const customerPart = withoutPrefix.slice(0, -5);
      const customerId = removeLeadingZeros(customerPart);
      
      const dateStr = parts[4];
      if (dateStr.length !== 8) continue;
      
      const orderDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
      const orderKey = `${customerId}-${orderDate}`;
      
      let order = orderGroups.get(orderKey);
      if (!order) {
        order = {
          order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          delivery_date: orderDate,
          status: 'pending',
          customer_id: customerId,
          bakery_id: bakeryId,
          order_products: []
        };
        orderGroups.set(orderKey, order);
      }
      
      order.order_products.push({
        product_original_id: productId,
        quantity,
        packing_status: 'pending'
      });
    } catch (e) {
      console.error('Error parsing order line:', e);
    }
  }
  
  return Array.from(orderGroups.values());
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let logId: string | null = null;
  const startTime = Date.now();

  try {
    const { bakeryId, files, triggeredBy } = await req.json();
    
    if (!bakeryId) {
      return new Response(
        JSON.stringify({ error: 'bakeryId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📥 Starting OneDrive import for bakery: ${bakeryId}`);

    // Create import log entry
    const { data: logData, error: logError } = await supabase
      .from('file_import_logs')
      .insert({
        bakery_id: bakeryId,
        source: 'onedrive',
        status: 'running',
        started_at: new Date().toISOString(),
        triggered_by: triggeredBy || null
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Failed to create import log:', logError);
    } else {
      logId = logData.id;
    }

    // Get OneDrive token
    const { data: tokenData, error: tokenError } = await supabase.rpc('get_decrypted_onedrive_token', {
      _bakery_id: bakeryId
    });

    if (tokenError || !tokenData || tokenData.length === 0) {
      throw new Error('OneDrive ikke tilkoblet');
    }

    let accessToken = tokenData[0].access_token;

    // Refresh if expired
    if (tokenData[0].is_expired) {
      console.log('🔄 Refreshing expired token...');
      const refreshResponse = await fetch(`${supabaseUrl}/functions/v1/onedrive-refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bakeryId })
      });

      if (!refreshResponse.ok) {
        throw new Error('Kunne ikke oppdatere OneDrive-token');
      }

      const { data: newTokenData } = await supabase.rpc('get_decrypted_onedrive_token', {
        _bakery_id: bakeryId
      });
      accessToken = newTokenData?.[0]?.access_token;
    }

    // Download and parse files
    const fileResults: any[] = [];
    let productsImported = 0;
    let customersImported = 0;
    let ordersCreated = 0;

    // ID mappings for order processing
    const productIdMapping: Record<string, string> = {};
    const customerIdMapping: Record<string, string> = {};

    // Sort files: PRD first, then CUS, then OD0
    const sortedFiles = [...files].sort((a: any, b: any) => {
      const order: Record<string, number> = { 'PRD': 1, 'CUS': 2, 'OD0': 3 };
      const aType = a.name.split('.').pop()?.toUpperCase() || '';
      const bType = b.name.split('.').pop()?.toUpperCase() || '';
      return (order[aType] || 99) - (order[bType] || 99);
    });

    for (const file of sortedFiles) {
      const fileType = file.name.split('.').pop()?.toUpperCase();
      console.log(`📄 Processing ${file.name} (${fileType})`);

      try {
        // Download file content
        const downloadResponse = await fetch(file.downloadUrl, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!downloadResponse.ok) {
          throw new Error(`Kunne ikke laste ned ${file.name}`);
        }

        const content = await downloadResponse.text();

        if (fileType === 'PRD') {
          // Parse and upsert products
          const products = parseProductFile(content, bakeryId);
          
          for (const product of products) {
            const { data, error } = await supabase
              .from('products')
              .upsert({
                bakery_id: bakeryId,
                product_number: product.product_number,
                name: product.name,
                category: product.category,
                is_active: product.is_active
              }, {
                onConflict: 'bakery_id,product_number',
                ignoreDuplicates: false
              })
              .select('id, product_number')
              .single();

            if (!error && data) {
              productIdMapping[product.original_id] = data.id;
              productsImported++;
            }
          }

          // Also fetch existing products to complete mapping
          const { data: existingProducts } = await supabase
            .from('products')
            .select('id, product_number')
            .eq('bakery_id', bakeryId);

          if (existingProducts) {
            for (const p of existingProducts) {
              if (p.product_number) {
                productIdMapping[p.product_number] = p.id;
                productIdMapping[removeLeadingZeros(p.product_number)] = p.id;
              }
            }
          }

          fileResults.push({ file: file.name, type: 'PRD', count: products.length, status: 'success' });

        } else if (fileType === 'CUS') {
          // Parse and upsert customers
          const customers = parseCustomerFile(content, bakeryId);
          
          for (const customer of customers) {
            const { data, error } = await supabase
              .from('customers')
              .upsert({
                bakery_id: bakeryId,
                customer_number: customer.customer_number,
                name: customer.name,
                address: customer.address,
                phone: customer.phone,
                status: customer.status
              }, {
                onConflict: 'bakery_id,customer_number',
                ignoreDuplicates: false
              })
              .select('id, customer_number')
              .single();

            if (!error && data) {
              customerIdMapping[customer.original_id] = data.id;
              customerIdMapping[customer.customer_number] = data.id;
              customersImported++;
            }
          }

          // Also fetch existing customers to complete mapping
          const { data: existingCustomers } = await supabase
            .from('customers')
            .select('id, customer_number')
            .eq('bakery_id', bakeryId);

          if (existingCustomers) {
            for (const c of existingCustomers) {
              if (c.customer_number) {
                customerIdMapping[c.customer_number] = c.id;
                customerIdMapping[removeLeadingZeros(c.customer_number)] = c.id;
              }
            }
          }

          fileResults.push({ file: file.name, type: 'CUS', count: customers.length, status: 'success' });

        } else if (fileType === 'OD0') {
          // Parse orders
          const orders = parseOrderFile(content, bakeryId);
          let ordersSkipped = 0;

          for (const order of orders) {
            // Map customer ID
            const dbCustomerId = customerIdMapping[order.customer_id];
            if (!dbCustomerId) {
              console.warn(`Customer not found: ${order.customer_id}`);
              ordersSkipped++;
              continue;
            }

            // Check for duplicate order
            const { data: existingOrder } = await supabase
              .from('orders')
              .select('id')
              .eq('bakery_id', bakeryId)
              .eq('customer_id', dbCustomerId)
              .eq('delivery_date', order.delivery_date)
              .maybeSingle();

            if (existingOrder) {
              console.log(`Skipping duplicate order for customer ${order.customer_id} on ${order.delivery_date}`);
              ordersSkipped++;
              continue;
            }

            // Create order
            const { data: newOrder, error: orderError } = await supabase
              .from('orders')
              .insert({
                bakery_id: bakeryId,
                customer_id: dbCustomerId,
                order_number: order.order_number,
                delivery_date: order.delivery_date,
                status: 'pending'
              })
              .select('id')
              .single();

            if (orderError || !newOrder) {
              console.error('Failed to create order:', orderError);
              continue;
            }

            // Create order products
            for (const op of order.order_products) {
              const dbProductId = productIdMapping[op.product_original_id];
              if (!dbProductId) {
                console.warn(`Product not found: ${op.product_original_id}`);
                continue;
              }

              await supabase
                .from('order_products')
                .insert({
                  order_id: newOrder.id,
                  bakery_id: bakeryId,
                  product_id: dbProductId,
                  quantity: op.quantity,
                  packing_status: 'pending'
                });
            }

            ordersCreated++;
          }

          fileResults.push({ 
            file: file.name, 
            type: 'OD0', 
            count: orders.length, 
            created: ordersCreated,
            skipped: ordersSkipped,
            status: 'success' 
          });
        }

      } catch (fileError: any) {
        console.error(`Error processing ${file.name}:`, fileError);
        fileResults.push({ file: file.name, status: 'error', error: fileError.message });
      }
    }

    const executionTime = Date.now() - startTime;

    // Update import log
    if (logId) {
      await supabase
        .from('file_import_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          execution_time_ms: executionTime,
          files_processed: sortedFiles.length,
          products_imported: productsImported,
          customers_imported: customersImported,
          orders_created: ordersCreated,
          file_results: fileResults
        })
        .eq('id', logId);
    }

    // Update import config with last import status
    await supabase
      .from('onedrive_import_config')
      .update({
        last_import_at: new Date().toISOString(),
        last_import_status: 'success'
      })
      .eq('bakery_id', bakeryId);

    console.log(`✅ Import completed in ${executionTime}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        executionTime,
        filesProcessed: sortedFiles.length,
        productsImported,
        customersImported,
        ordersCreated,
        fileResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Import error:', error);

    // Update log with error
    if (logId) {
      await supabase
        .from('file_import_logs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          execution_time_ms: Date.now() - startTime,
          error_message: error.message
        })
        .eq('id', logId);
    }

    return new Response(
      JSON.stringify({ error: error.message || 'Import feilet' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

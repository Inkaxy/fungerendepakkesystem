-- Add color_index column to active_packing_products
-- This stores the stable color slot (0, 1, or 2) for each product
ALTER TABLE public.active_packing_products 
ADD COLUMN color_index integer DEFAULT 0;

-- Add constraint to ensure color_index is 0, 1, or 2
ALTER TABLE public.active_packing_products 
ADD CONSTRAINT color_index_range CHECK (color_index >= 0 AND color_index <= 2);

-- Backfill existing rows with color_index based on creation order
-- This ensures existing active products get distributed across slots 0, 1, 2
WITH numbered_products AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY bakery_id, session_date ORDER BY created_at, product_name) - 1 AS row_num
  FROM public.active_packing_products
)
UPDATE public.active_packing_products app
SET color_index = (np.row_num % 3)::integer
FROM numbered_products np
WHERE app.id = np.id;
-- Legg til CASCADE på foreign keys for å tillate automatisk sletting av tilknyttet data

-- Fjern og gjenopprett foreign key på orders.customer_id med CASCADE
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;

ALTER TABLE orders
ADD CONSTRAINT orders_customer_id_fkey 
FOREIGN KEY (customer_id) 
REFERENCES customers(id) 
ON DELETE CASCADE;

-- Fjern og gjenopprett foreign key på order_products.order_id med CASCADE
ALTER TABLE order_products 
DROP CONSTRAINT IF EXISTS order_products_order_id_fkey;

ALTER TABLE order_products
ADD CONSTRAINT order_products_order_id_fkey 
FOREIGN KEY (order_id) 
REFERENCES orders(id) 
ON DELETE CASCADE;

-- Kommentar: Når en kunde slettes, vil alle tilknyttede ordrer og deres produkter automatisk slettes
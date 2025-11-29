-- Sett REPLICA IDENTITY FULL på active_packing_products for å få payload.old data ved DELETE events
ALTER TABLE active_packing_products REPLICA IDENTITY FULL;

-- Verifiser at endringen er gjort
COMMENT ON TABLE active_packing_products IS 'Packing products with REPLICA IDENTITY FULL for complete realtime DELETE events';
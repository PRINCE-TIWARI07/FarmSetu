DO $$
BEGIN
  ALTER TABLE "Product" REPLICA IDENTITY FULL;
  ALTER TABLE "ProductImage" REPLICA IDENTITY FULL;
  ALTER TABLE "Inventory" REPLICA IDENTITY FULL;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'Product'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "Product";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'ProductImage'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "ProductImage";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'Inventory'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "Inventory";
  END IF;
END $$;

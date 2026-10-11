-- Admin-editable product name/price overrides.
-- The storefront catalog is defined in static data files; this table stores
-- per-product overrides keyed by the catalog product id. Prices are stored in
-- USD and auto-converted for shoppers at render time.
CREATE TABLE IF NOT EXISTS "ProductOverride" (
  "productId" TEXT PRIMARY KEY,
  "name"      TEXT,
  "price"     DECIMAL(10, 2),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

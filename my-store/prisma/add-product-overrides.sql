-- Admin-editable product overrides.
-- The storefront catalog is defined in static data files; this table stores
-- per-product overrides keyed by the catalog product id. Prices are stored in
-- USD and auto-converted for shoppers at render time. `soldOutSizes` and
-- `soldOutColors` hold JSON string arrays of variants that are sold out.
CREATE TABLE IF NOT EXISTS "ProductOverride" (
  "productId"       TEXT PRIMARY KEY,
  "name"            TEXT,
  "price"           DECIMAL(10, 2),
  "discountPercent" DECIMAL(5, 2),
  "soldOut"         BOOLEAN NOT NULL DEFAULT false,
  "soldOutSizes"    TEXT,
  "soldOutColors"   TEXT,
  "updatedBy"       TEXT,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Extend ProductOverride with per-variant sold-out state and discounts.
-- Idempotent: safe to re-run. `soldOutSizes`/`soldOutColors` hold JSON string
-- arrays of the variants that are sold out.
ALTER TABLE "ProductOverride"
  ADD COLUMN IF NOT EXISTS "discountPercent" DECIMAL(5, 2);
ALTER TABLE "ProductOverride"
  ADD COLUMN IF NOT EXISTS "soldOut" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ProductOverride"
  ADD COLUMN IF NOT EXISTS "soldOutSizes" TEXT;
ALTER TABLE "ProductOverride"
  ADD COLUMN IF NOT EXISTS "soldOutColors" TEXT;

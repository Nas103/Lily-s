-- Payout bookkeeping: charge currency snapshot + dispute-window release time.
-- Idempotent (IF NOT EXISTS) per repo migration convention.

ALTER TABLE "Payout" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "Payout" ADD COLUMN IF NOT EXISTS "availableAt" TIMESTAMP(3);
CREATE UNIQUE INDEX IF NOT EXISTS "Payout_brandId_orderId_key" ON "Payout"("brandId", "orderId");

-- Multi-vendor marketplace foundation (Phase 1).
-- Idempotent: safe to re-run. Applies the Brand models added to schema.prisma.
--
-- Notes:
--  * The static catalog (src/data + mobile-app data files) is untouched;
--    brand products live in "Product" with "brandId" set. House DB rows keep
--    brandId = null.
--  * Category has no client-side default (Prisma @default(uuid()) is applied
--    by the client), so seeds supply gen_random_uuid() explicitly.

-- 1. New role -----------------------------------------------------------------
-- Cannot run inside a transaction block on PG < 12 and the new value cannot be
-- used until this statement commits; run it standalone (this script is applied
-- statement-by-statement).
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'BRAND';

-- 2. New enum types ------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "BrandStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "VerificationStatus" AS ENUM ('UNSUBMITTED', 'PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BrandOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Brand ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Brand" (
  "id"                    TEXT NOT NULL,
  "userId"                TEXT NOT NULL,
  "name"                  TEXT NOT NULL,
  "slug"                  TEXT NOT NULL,
  "description"           TEXT,
  "logoUrl"               TEXT,
  "website"               TEXT,
  "contactEmail"          TEXT NOT NULL,
  "contactPhone"          TEXT,
  "country"               TEXT,
  "status"                "BrandStatus" NOT NULL DEFAULT 'PENDING',
  "verificationStatus"    "VerificationStatus" NOT NULL DEFAULT 'UNSUBMITTED',
  "verificationDocUrl"    TEXT,
  "businessName"          TEXT,
  "taxId"                 TEXT,
  "rejectionReason"       TEXT,
  "reviewedBy"            TEXT,
  "reviewedAt"            TIMESTAMP(3),
  "stripeAccountId"       TEXT,
  "commissionRate"        DECIMAL(5,2) NOT NULL DEFAULT 15,
  "subscriptionTier"      "SubscriptionTier" NOT NULL DEFAULT 'FREE',
  "subscriptionExpiresAt" TIMESTAMP(3),
  "stripeSubscriptionId"  TEXT,
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Brand_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Brand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Brand_slug_key" UNIQUE ("slug"),
  CONSTRAINT "Brand_userId_key" UNIQUE ("userId")
);

CREATE INDEX IF NOT EXISTS "Brand_status_idx" ON "Brand"("status");

-- 4. Product: ownership + marketplace catalog fields ----------------------------
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "brandId" TEXT,
  ADD COLUMN IF NOT EXISTS "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS "highlight" TEXT,
  ADD COLUMN IF NOT EXISTS "subCategory" TEXT,
  ADD COLUMN IF NOT EXISTS "gender" TEXT,
  ADD COLUMN IF NOT EXISTS "badge" TEXT,
  ADD COLUMN IF NOT EXISTS "tags" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "sizes" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "colors" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "colorImages" JSONB,
  ADD COLUMN IF NOT EXISTS "discountPercent" DECIMAL(5,2);

-- ON DELETE SET NULL matches schema.prisma (onDelete: SetNull).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_brandId_fkey') THEN
    ALTER TABLE "Product"
      ADD CONSTRAINT "Product_brandId_fkey"
      FOREIGN KEY ("brandId") REFERENCES "Brand"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX IF NOT EXISTS "Product_status_idx" ON "Product"("status");

-- 5. OrderItem: owning brand ------------------------------------------------------
ALTER TABLE "OrderItem"
  ADD COLUMN IF NOT EXISTS "brandId" TEXT;

CREATE INDEX IF NOT EXISTS "OrderItem_brandId_idx" ON "OrderItem"("brandId");

-- 6. Per-brand fulfilment slices ----------------------------------------------------
CREATE TABLE IF NOT EXISTS "BrandOrder" (
  "id"             TEXT NOT NULL,
  "orderId"        TEXT NOT NULL,
  "brandId"        TEXT NOT NULL,
  "status"         "BrandOrderStatus" NOT NULL DEFAULT 'PENDING',
  "trackingNumber" TEXT,
  "notes"          TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BrandOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BrandOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BrandOrder_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "BrandOrder_orderId_brandId_key" ON "BrandOrder"("orderId", "brandId");
CREATE INDEX IF NOT EXISTS "BrandOrder_brandId_idx" ON "BrandOrder"("brandId");

-- 7. Payouts ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Payout" (
  "id"               TEXT NOT NULL,
  "brandId"          TEXT NOT NULL,
  "orderId"          TEXT NOT NULL,
  "amount"           DECIMAL(10,2) NOT NULL,
  "platformFee"      DECIMAL(10,2) NOT NULL,
  "status"           "PayoutStatus" NOT NULL DEFAULT 'PENDING',
  "stripeTransferId" TEXT,
  "failureReason"    TEXT,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt"           TIMESTAMP(3),

  CONSTRAINT "Payout_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Payout_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Payout_brandId_idx" ON "Payout"("brandId");
CREATE INDEX IF NOT EXISTS "Payout_orderId_idx" ON "Payout"("orderId");
CREATE INDEX IF NOT EXISTS "Payout_status_idx" ON "Payout"("status");

-- 8. Brand messages --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "BrandMessage" (
  "id"         TEXT NOT NULL,
  "brandId"    TEXT NOT NULL,
  "orderId"    TEXT,
  "fromUserId" TEXT NOT NULL,
  "fromRole"   "UserRole" NOT NULL,
  "toUserId"   TEXT,
  "body"       TEXT NOT NULL,
  "readAt"     TIMESTAMP(3),
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BrandMessage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BrandMessage_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "BrandMessage_brandId_createdAt_idx" ON "BrandMessage"("brandId", "createdAt");
CREATE INDEX IF NOT EXISTS "BrandMessage_orderId_idx" ON "BrandMessage"("orderId");
CREATE INDEX IF NOT EXISTS "BrandMessage_fromUserId_idx" ON "BrandMessage"("fromUserId");

-- 9. Seed storefront categories (Product.categoryId is NOT NULL; the table is
--    empty in production and brand products must resolve to a category). -------
INSERT INTO "Category" ("id", "name", "slug") VALUES
  (gen_random_uuid()::text, 'Men',         'men'),
  (gen_random_uuid()::text, 'Women',       'women'),
  (gen_random_uuid()::text, 'Lifestyle',   'lifestyle'),
  (gen_random_uuid()::text, 'Running',     'running'),
  (gen_random_uuid()::text, 'Boxraw',      'boxraw'),
  (gen_random_uuid()::text, 'Electronics', 'electronics'),
  (gen_random_uuid()::text, 'Perfumes',    'perfumes'),
  (gen_random_uuid()::text, 'Featured',    'featured')
ON CONFLICT ("slug") DO NOTHING;

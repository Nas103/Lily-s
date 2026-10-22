-- Brand verification documents uploaded directly from the dashboard.
-- Stored in Postgres so they survive redeploys (serverless filesystems are
-- ephemeral). Idempotent: safe to re-run.

ALTER TABLE "Brand"
  ADD COLUMN IF NOT EXISTS "verificationDocName" TEXT,
  ADD COLUMN IF NOT EXISTS "verificationDocMimeType" TEXT,
  ADD COLUMN IF NOT EXISTS "verificationDocSize" INTEGER,
  ADD COLUMN IF NOT EXISTS "verificationDocData" BYTEA,
  ADD COLUMN IF NOT EXISTS "verificationDocUploadedAt" TIMESTAMP(3);

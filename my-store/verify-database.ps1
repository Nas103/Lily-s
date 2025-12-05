# Database Verification Script
# Verifies that your database is properly configured

Write-Host "🔍 Verifying Database Configuration" -ForegroundColor Cyan
Write-Host ""

# Check 1: DATABASE_URL
Write-Host "1. Checking DATABASE_URL..." -ForegroundColor Yellow
if ($env:DATABASE_URL) {
    $dbUrl = $env:DATABASE_URL
    if ($dbUrl -match "postgresql://") {
        Write-Host "   ✅ DATABASE_URL is set" -ForegroundColor Green
        # Mask password in output
        $maskedUrl = $dbUrl -replace "://[^:]+:[^@]+@", "://***:***@"
        Write-Host "   Connection: $maskedUrl" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  DATABASE_URL doesn't look like a PostgreSQL connection string" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ DATABASE_URL is not set" -ForegroundColor Red
    Write-Host "   Set it in .env.local or Vercel environment variables" -ForegroundColor Gray
}
Write-Host ""

# Check 2: Prisma Client
Write-Host "2. Checking Prisma Client..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma\client\index.js") {
    Write-Host "   ✅ Prisma Client is generated" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Prisma Client not found" -ForegroundColor Yellow
    Write-Host "   Run: npx prisma generate" -ForegroundColor Gray
}
Write-Host ""

# Check 3: Database Connection (if DATABASE_URL is set)
if ($env:DATABASE_URL) {
    Write-Host "3. Testing database connection..." -ForegroundColor Yellow
    try {
        $result = npx prisma db execute --stdin --schema=prisma/schema.prisma 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Database connection successful" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Could not verify connection" -ForegroundColor Yellow
            Write-Host "   Try: npx prisma db push" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ⚠️  Could not test connection" -ForegroundColor Yellow
    }
} else {
    Write-Host "3. Skipping connection test (DATABASE_URL not set)" -ForegroundColor Gray
}
Write-Host ""

# Check 4: Schema file
Write-Host "4. Checking Prisma schema..." -ForegroundColor Yellow
if (Test-Path "prisma\schema.prisma") {
    Write-Host "   ✅ Schema file exists" -ForegroundColor Green
    $schemaContent = Get-Content "prisma\schema.prisma" -Raw
    $modelCount = ([regex]::Matches($schemaContent, "model\s+\w+")).Count
    Write-Host "   Found $modelCount models" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Schema file not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   - Make sure DATABASE_URL is set in Vercel for production" -ForegroundColor White
Write-Host "   - Run 'npx prisma db push' to create tables" -ForegroundColor White
Write-Host "   - Verify tables exist in Supabase Dashboard" -ForegroundColor White
Write-Host ""


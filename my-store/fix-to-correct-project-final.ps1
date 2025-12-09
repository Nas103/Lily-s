# Update to Correct Project - Final Fix
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update to Correct Project (Final)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

# Correct settings
$projectId = "tnpspjnxnsfsdllkkgbd"
$region = "eu-west-1"
$password = "nas|1017}R$"

# Properly URL encode the password
$encoded = [System.Uri]::EscapeDataString($password)

Write-Host "Updating to correct project:" -ForegroundColor Yellow
Write-Host "Project ID: $projectId" -ForegroundColor Cyan
Write-Host "Region: $region" -ForegroundColor Cyan
Write-Host "Password (encoded): $encoded" -ForegroundColor Gray
Write-Host ""

# Build correct connection string
$correctUrl = "postgresql://postgres.${projectId}:${encoded}@aws-1-${region}.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host "Updating DATABASE_URL..." -ForegroundColor Yellow

# Read and update file
$content = Get-Content $envFile
$newContent = $content | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$correctUrl`""
    } else {
        $_
    }
}

$newContent | Set-Content $envFile -Encoding UTF8

Write-Host "✅ DATABASE_URL updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection string:" -ForegroundColor Cyan
Write-Host "postgresql://postgres.${projectId}:***@aws-1-${region}.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15" -ForegroundColor Gray
Write-Host ""
Write-Host "Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Cyan
node scripts/verify-tables.js

Write-Host ""
Write-Host "If tables don't exist, create them using:" -ForegroundColor Yellow
Write-Host "1. Supabase SQL Editor" -ForegroundColor White
Write-Host "2. Run: create-tables.sql" -ForegroundColor White


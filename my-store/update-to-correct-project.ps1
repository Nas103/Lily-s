# Update to Correct Project Connection String
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update to Correct Project" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

# Password with URL encoding
$password = "nas|1017}R$"
$encoded = $password -replace '\|', '%7C' -replace '\}', '%7D' -replace '\$', '%24'

# Correct connection string (Transaction Pooler)
$correctUrl = "postgresql://postgres.cerclrsxxsrladrhwbme:${encoded}@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host "Updating DATABASE_URL to correct project..." -ForegroundColor Yellow
Write-Host "Project: cerclrsxxsrladrhwbme" -ForegroundColor Cyan
Write-Host "Region: us-east-1" -ForegroundColor Cyan
Write-Host "Connection: Transaction Pooler (port 6543)" -ForegroundColor Cyan
Write-Host ""

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

Write-Host "✅ DATABASE_URL updated to correct project!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection string:" -ForegroundColor Cyan
Write-Host "postgresql://postgres.cerclrsxxsrladrhwbme:***@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15" -ForegroundColor Gray
Write-Host ""
Write-Host "Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test connection: node scripts/verify-tables.js" -ForegroundColor White
Write-Host "2. Start Prisma Studio: npm run db:studio" -ForegroundColor White
Write-Host "3. Start your app: npm run dev" -ForegroundColor White


# Update to New Supabase Project
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update to New Supabase Project" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

# New project details
$projectId = "zcsosspieuolzswujvpw"
$password = "mashala1017nudy"
$region = "eu-west-1"

# Build connection string with Transaction Pooler (port 6543)
$connectionString = "postgresql://postgres.${projectId}:${password}@aws-1-${region}.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host "Updating DATABASE_URL to new project:" -ForegroundColor Yellow
Write-Host "Project ID: $projectId" -ForegroundColor Cyan
Write-Host "Region: $region" -ForegroundColor Cyan
Write-Host "Connection: Transaction Pooler (port 6543)" -ForegroundColor Cyan
Write-Host "Tables: Already created ✓" -ForegroundColor Green
Write-Host ""

# Read and update file
$content = Get-Content $envFile
$newContent = $content | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$connectionString`""
    } else {
        $_
    }
}

$newContent | Set-Content $envFile -Encoding UTF8

Write-Host "✅ DATABASE_URL updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Cyan
node scripts/verify-tables.js

Write-Host ""
Write-Host "If connection works, you can now:" -ForegroundColor Yellow
Write-Host "1. Start Prisma Studio: npm run db:studio" -ForegroundColor White
Write-Host "2. Start your app: npm run dev" -ForegroundColor White
Write-Host "3. Deploy to Vercel - update DATABASE_URL there too" -ForegroundColor White


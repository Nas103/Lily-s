# Update DATABASE_URL to use direct PostgreSQL connection
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Switch to Direct PostgreSQL Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

Write-Host "This will update DATABASE_URL to use direct connection (port 5432)" -ForegroundColor Yellow
Write-Host "instead of Connection Pooling (port 6543)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Direct connection works better with Prisma Studio" -ForegroundColor Green
Write-Host ""

# Get password
Write-Host "Enter your database password:" -ForegroundColor Cyan
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# URL encode the password
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($passwordPlain)

# Build direct connection URL (port 5432, not 6543)
$newUrl = "postgresql://postgres.tnpspjnxnsfsdllkkgbd:${passwordEncoded}@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require"

Write-Host ""
Write-Host "New DATABASE_URL (direct connection):" -ForegroundColor Green
Write-Host "postgresql://postgres.tnpspjnxnsfsdllkkgbd:***@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require" -ForegroundColor Gray

Write-Host ""
Write-Host "Updating .env.local..." -ForegroundColor Yellow

# Read the file
$content = Get-Content $envFile

# Replace DATABASE_URL line
$newContent = $content | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$newUrl`""
    } else {
        $_
    }
}

# Write back
$newContent | Set-Content $envFile -Encoding UTF8

Write-Host "✅ DATABASE_URL updated to direct connection!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. npx prisma generate" -ForegroundColor White
Write-Host "2. node scripts/verify-tables.js" -ForegroundColor White
Write-Host "3. npm run db:studio" -ForegroundColor White


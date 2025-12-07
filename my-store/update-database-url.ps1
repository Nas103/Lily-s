# Update DATABASE_URL with correct project ID
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update DATABASE_URL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Current DATABASE_URL:" -ForegroundColor Yellow
$currentUrl = (Get-Content $envFile | Select-String "DATABASE_URL").ToString()
if ($currentUrl) {
    Write-Host $currentUrl -ForegroundColor Gray
} else {
    Write-Host "Not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Enter your database password:" -ForegroundColor Cyan
Write-Host "(The password from your Supabase connection string)" -ForegroundColor Gray
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# URL encode the password (handle special characters)
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($passwordPlain)

# Build the new DATABASE_URL
$newUrl = "postgresql://postgres.tnpspjnxnsfsdllkkgbd:${passwordEncoded}@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host ""
Write-Host "New DATABASE_URL:" -ForegroundColor Green
Write-Host "postgresql://postgres.tnpspjnxnsfsdllkkgbd:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15" -ForegroundColor Gray

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

Write-Host "✅ DATABASE_URL updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. npx prisma generate" -ForegroundColor White
Write-Host "2. npm run db:studio" -ForegroundColor White


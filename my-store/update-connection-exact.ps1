# Update Connection String - Exact from Supabase
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update Connection String (Exact)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

# Password from connection string
$password = "nas|1017}R$"

# URL encode the password properly
$encoded = [System.Uri]::EscapeDataString($password)

Write-Host "Password encoding:" -ForegroundColor Cyan
Write-Host "Original: $password" -ForegroundColor White
Write-Host "Encoded:  $encoded" -ForegroundColor Green
Write-Host ""

# Build connection string with port 5432 (as shown in Supabase)
$correctUrl = "postgresql://postgres.tnpspjnxnsfsdllkkgbd:${encoded}@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host "Updating DATABASE_URL..." -ForegroundColor Yellow
Write-Host "Project: tnpspjnxnsfsdllkkgbd" -ForegroundColor Cyan
Write-Host "Region: eu-west-1" -ForegroundColor Cyan
Write-Host "Port: 5432" -ForegroundColor Cyan
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

Write-Host "✅ DATABASE_URL updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection string:" -ForegroundColor Cyan
Write-Host "postgresql://postgres.tnpspjnxnsfsdllkkgbd:***@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true&connect_timeout=15" -ForegroundColor Gray
Write-Host ""
Write-Host "Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Cyan
node scripts/verify-tables.js


# Fix Password Authentication - Complete Fix
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix Database Password Authentication" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

Write-Host "Authentication failed - password issue detected" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your connection string from Supabase:" -ForegroundColor Cyan
Write-Host "postgresql://postgres.cerclrsxxsrladrhwbme:nas|1017}R$@aws-1-us-east-1.pooler.supabase.com:6543/postgres" -ForegroundColor Gray
Write-Host ""
Write-Host "The password 'nas|1017}R$' needs proper URL encoding" -ForegroundColor Yellow
Write-Host ""

# Properly encode the password
$password = "nas|1017}R$"
# URL encode all special characters
$encoded = [System.Uri]::EscapeDataString($password)

Write-Host "Password encoding:" -ForegroundColor Cyan
Write-Host "Original: $password" -ForegroundColor White
Write-Host "Encoded:  $encoded" -ForegroundColor Green
Write-Host ""

# Build correct connection string
$correctUrl = "postgresql://postgres.cerclrsxxsrladrhwbme:${encoded}@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

Write-Host "Updating DATABASE_URL with properly encoded password..." -ForegroundColor Yellow

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
Write-Host "postgresql://postgres.cerclrsxxsrladrhwbme:***@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15" -ForegroundColor Gray
Write-Host ""
Write-Host "Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Test the connection:" -ForegroundColor Yellow
Write-Host "node scripts/verify-tables.js" -ForegroundColor White
Write-Host ""
Write-Host "If still getting authentication error:" -ForegroundColor Yellow
Write-Host "1. Verify password in Supabase Dashboard → Settings → Database" -ForegroundColor White
Write-Host "2. Make sure you're using the correct project (cerclrsxxsrladrhwbme)" -ForegroundColor White
Write-Host "3. Try resetting the database password in Supabase" -ForegroundColor White


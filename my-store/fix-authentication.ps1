# Fix Database Authentication Error
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix Database Authentication" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

Write-Host "The authentication error means the password is incorrect or not properly encoded." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your connection string should be:" -ForegroundColor Cyan
Write-Host "postgresql://postgres.cerclrsxxsrladrhwbme:nas|1017}R$@aws-1-us-east-1.pooler.supabase.com:6543/postgres" -ForegroundColor Gray
Write-Host ""
Write-Host "But the password needs to be URL-encoded:" -ForegroundColor Yellow
Write-Host "nas|1017}R$  →  nas%7C1017%7DR%24" -ForegroundColor White
Write-Host ""

# Get password from user
Write-Host "Enter your database password:" -ForegroundColor Cyan
Write-Host "(The password from your Supabase connection string)" -ForegroundColor Gray
$password = Read-Host

# URL encode special characters
$encoded = $password -replace '\|', '%7C' -replace '\}', '%7D' -replace '\$', '%24' -replace '&', '%26' -replace '#', '%23' -replace '\?', '%3F' -replace '/', '%2F' -replace ':', '%3A' -replace '@', '%40' -replace '=', '%3D' -replace '\+', '%2B'

Write-Host ""
Write-Host "Password (encoded): $encoded" -ForegroundColor Gray
Write-Host ""

# Build connection string
$correctUrl = "postgresql://postgres.cerclrsxxsrladrhwbme:${encoded}@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"

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

Write-Host "✅ DATABASE_URL updated with properly encoded password!" -ForegroundColor Green
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Cyan
npx prisma generate

Write-Host ""
Write-Host "Next: Test the connection:" -ForegroundColor Yellow
Write-Host "node scripts/verify-tables.js" -ForegroundColor White


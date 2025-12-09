# Fix DATABASE_URL - Final correct version
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix DATABASE_URL - Final" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"

# Correct connection string
$password = "nas|1017}R$"
$encoded = $password -replace '\|', '%7C' -replace '\}', '%7D' -replace '\$', '%24'

$correctUrl = "postgresql://postgres.tnpspjnxnsfsdllkkgbd:${encoded}@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require"

Write-Host "Setting correct DATABASE_URL:" -ForegroundColor Yellow
Write-Host "postgresql://postgres.tnpspjnxnsfsdllkkgbd:***@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require" -ForegroundColor Gray
Write-Host ""

# Read the file
$content = Get-Content $envFile

# Replace DATABASE_URL line
$newContent = $content | ForEach-Object {
    if ($_ -match "^DATABASE_URL=") {
        "DATABASE_URL=`"$correctUrl`""
    } else {
        $_
    }
}

# Write back
$newContent | Set-Content $envFile -Encoding UTF8

Write-Host "✅ DATABASE_URL fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "Fixed issues:" -ForegroundColor Cyan
Write-Host "- Removed double 'postgresql://' prefix" -ForegroundColor White
Write-Host "- Correct username: postgres.tnpspjnxnsfsdllkkgbd" -ForegroundColor White
Write-Host "- URL-encoded password" -ForegroundColor White
Write-Host "- Direct connection (port 5432)" -ForegroundColor White
Write-Host ""
Write-Host "Next: npx prisma generate && npm run db:studio" -ForegroundColor Yellow


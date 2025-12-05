# Update DATABASE_URL to use Connection Pooling
# This fixes the "Can't reach database server" error

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update to Connection Pooling" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Current connection uses direct connection (port 5432)" -ForegroundColor Yellow
Write-Host "This may not be accessible from your network." -ForegroundColor Yellow
Write-Host ""

Write-Host "To fix this, you need to:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to Supabase Dashboard:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Select your project" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to: Settings -> Database" -ForegroundColor White
Write-Host ""
Write-Host "4. Scroll to 'Connection Pooling' section" -ForegroundColor White
Write-Host ""
Write-Host "5. Under 'Connection string', select 'Session' mode" -ForegroundColor White
Write-Host ""
Write-Host "6. Copy the connection string" -ForegroundColor White
Write-Host "   (It should have .pooler and port 6543)" -ForegroundColor Gray
Write-Host ""
Write-Host "7. Paste it below when prompted" -ForegroundColor White
Write-Host ""

$newUrl = Read-Host "Paste the Connection Pooling string here"

if ($newUrl -and $newUrl -match "pooler") {
    Write-Host ""
    Write-Host "Updating .env.local..." -ForegroundColor Cyan
    
    # Read current file
    $content = Get-Content .env.local -Raw
    
    # Replace DATABASE_URL line
    if ($content -match 'DATABASE_URL=.+') {
        $newContent = $content -replace 'DATABASE_URL=.+', "DATABASE_URL=$newUrl"
        
        # Save as UTF-8
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText((Resolve-Path .env.local), $newContent, $utf8NoBom)
        
        Write-Host "SUCCESS: Updated DATABASE_URL to use Connection Pooling" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Restart your dev server (Ctrl+C, then npm run dev)" -ForegroundColor White
        Write-Host "2. Test the connection: node scripts/verify-db.js" -ForegroundColor White
    } else {
        Write-Host "ERROR: Could not find DATABASE_URL in .env.local" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "ERROR: Invalid connection string" -ForegroundColor Red
    Write-Host "Make sure it contains 'pooler' and uses port 6543" -ForegroundColor Yellow
}

Write-Host ""


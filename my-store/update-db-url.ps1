# Quick script to update DATABASE_URL to Connection Pooling

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update DATABASE_URL to Connection Pooling" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Current connection uses direct connection (port 5432)" -ForegroundColor Yellow
Write-Host "This is why you're getting connection errors." -ForegroundColor Yellow
Write-Host ""

Write-Host "To get the Connection Pooling string:" -ForegroundColor Cyan
Write-Host "1. Go to: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Settings -> Database" -ForegroundColor White
Write-Host "4. Scroll to 'Connection Pooling'" -ForegroundColor White
Write-Host "5. Copy the 'Session' mode connection string" -ForegroundColor White
Write-Host "   (Should have .pooler and port 6543)" -ForegroundColor Gray
Write-Host ""

$newUrl = Read-Host "Paste the Connection Pooling string here"

if ($newUrl) {
    # Validate it looks like a pooling URL
    if ($newUrl -match "pooler" -and $newUrl -match "6543") {
        Write-Host ""
        Write-Host "Valid Connection Pooling string detected!" -ForegroundColor Green
        Write-Host "Updating .env.local..." -ForegroundColor Cyan
        
        # Read current file
        if (Test-Path .env.local) {
            $content = Get-Content .env.local -Raw
            
            # Replace DATABASE_URL line
            if ($content -match 'DATABASE_URL=.+') {
                $newContent = $content -replace 'DATABASE_URL=.+', "DATABASE_URL=$newUrl"
                
                # Save as UTF-8 without BOM
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText((Resolve-Path .env.local), $newContent, $utf8NoBom)
                
                Write-Host ""
                Write-Host "SUCCESS! Updated DATABASE_URL" -ForegroundColor Green
                Write-Host ""
                Write-Host "Next steps:" -ForegroundColor Cyan
                Write-Host "1. Restart your dev server:" -ForegroundColor White
                Write-Host "   - Press Ctrl+C to stop current server" -ForegroundColor Gray
                Write-Host "   - Run: npm run dev" -ForegroundColor Gray
                Write-Host ""
                Write-Host "2. Test the connection:" -ForegroundColor White
                Write-Host "   node scripts/verify-db.js" -ForegroundColor Gray
                Write-Host ""
                Write-Host "3. Try login/signup again!" -ForegroundColor White
            } else {
                Write-Host "ERROR: Could not find DATABASE_URL in .env.local" -ForegroundColor Red
            }
        } else {
            Write-Host "ERROR: .env.local file not found" -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "WARNING: This doesn't look like a Connection Pooling string" -ForegroundColor Yellow
        Write-Host "Connection Pooling should have:" -ForegroundColor Yellow
        Write-Host "  - '.pooler' in the hostname" -ForegroundColor Gray
        Write-Host "  - Port 6543 (not 5432)" -ForegroundColor Gray
        Write-Host ""
        $continue = Read-Host "Do you want to use it anyway? (y/n)"
        if ($continue -eq "y") {
            # Same update logic as above
            $content = Get-Content .env.local -Raw
            $newContent = $content -replace 'DATABASE_URL=.+', "DATABASE_URL=$newUrl"
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText((Resolve-Path .env.local), $newContent, $utf8NoBom)
            Write-Host "Updated. Please restart your dev server." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "No string provided. Exiting." -ForegroundColor Red
}

Write-Host ""


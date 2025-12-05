# Fix DATABASE_URL encoding in .env.local
# Special characters in passwords need to be URL-encoded

Write-Host "Fixing DATABASE_URL encoding..." -ForegroundColor Cyan
Write-Host ""

$envPath = ".env.local"

if (-not (Test-Path $envPath)) {
    Write-Host "ERROR: .env.local file not found" -ForegroundColor Red
    exit 1
}

# Read the file as UTF-8
$content = Get-Content $envPath -Raw

# Check if DATABASE_URL exists
if ($content -match 'DATABASE_URL=(.+)') {
    $dbUrl = $matches[1].Trim()
    
    Write-Host "Current DATABASE_URL:" -ForegroundColor Yellow
    Write-Host $dbUrl -ForegroundColor Gray
    Write-Host ""
    
    # Check if it needs encoding
    if ($dbUrl -match '[|}$]') {
        Write-Host "WARNING: Password contains special characters that need URL encoding" -ForegroundColor Yellow
        Write-Host ""
        
        # Extract parts using regex
        if ($dbUrl -match 'postgresql://([^:]+):([^@]+)@(.+)') {
            $user = $matches[1]
            $password = $matches[2]
            $dbHost = $matches[3]
            
            # URL encode special characters in password
            $encodedPassword = $password -replace '\|', '%7C' -replace '\}', '%7D' -replace '\$', '%24'
            
            $newUrl = "postgresql://${user}:${encodedPassword}@${dbHost}"
            
            Write-Host "Encoded DATABASE_URL:" -ForegroundColor Green
            Write-Host $newUrl -ForegroundColor Gray
            Write-Host ""
            
            # Update the file
            $newContent = $content -replace 'DATABASE_URL=.+', "DATABASE_URL=$newUrl"
            
            # Save as UTF-8 without BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText((Resolve-Path $envPath), $newContent, $utf8NoBom)
            
            Write-Host "SUCCESS: Updated .env.local with URL-encoded password" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "   1. Run: node scripts/verify-db.js" -ForegroundColor White
            Write-Host "   2. Or: npx prisma db push" -ForegroundColor White
        } else {
            Write-Host "ERROR: Could not parse DATABASE_URL format" -ForegroundColor Red
        }
    } else {
        Write-Host "SUCCESS: DATABASE_URL looks good (no special characters to encode)" -ForegroundColor Green
    }
} else {
    Write-Host "ERROR: DATABASE_URL not found in .env.local" -ForegroundColor Red
}

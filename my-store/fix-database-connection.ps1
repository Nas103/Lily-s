# Fix Database Connection Script
# This script helps you update DATABASE_URL with the correct Supabase connection string

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix Database Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    New-Item -Path ".env.local" -ItemType File | Out-Null
}

Write-Host "The error 'Tenant or user not found' usually means:" -ForegroundColor Yellow
Write-Host "  1. The database password is incorrect" -ForegroundColor White
Write-Host "  2. The project ID in the connection string is wrong" -ForegroundColor White
Write-Host "  3. The password needs URL encoding" -ForegroundColor White
Write-Host ""

Write-Host "To fix this, you need to get the CORRECT connection string from Supabase:" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Steps:" -ForegroundColor Cyan
Write-Host "  1. Go to: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "  2. Select your project" -ForegroundColor White
Write-Host "  3. Go to: Settings → Database" -ForegroundColor White
Write-Host "  4. Scroll to 'Connection Pooling'" -ForegroundColor White
Write-Host "  5. Select 'Transaction' mode (port 6543)" -ForegroundColor White
Write-Host "  6. Copy the connection string" -ForegroundColor White
Write-Host ""

$connectionString = Read-Host "Paste the Connection Pooling string here (Transaction pooler, port 6543)"

if ([string]::IsNullOrWhiteSpace($connectionString)) {
    Write-Host "❌ No connection string provided. Exiting." -ForegroundColor Red
    exit 1
}

# Check if it's a valid connection string
if (-not $connectionString -match "pooler\.supabase\.com:6543") {
    Write-Host "⚠️  Warning: This doesn't look like a Transaction Pooler connection string." -ForegroundColor Yellow
    Write-Host "   Make sure you're using the 'Transaction' pooler with port 6543" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Extract password from connection string for URL encoding
if ($connectionString -match "://[^:]+:([^@]+)@") {
    $password = $matches[1]
    Write-Host ""
    Write-Host "Found password in connection string. Checking if it needs URL encoding..." -ForegroundColor Yellow
    
    # Check if password contains special characters that need encoding
    if ($password -match "[|}\$#@!%^&*()+=`[\]{};:'`"<>?,./]") {
        Write-Host "⚠️  Password contains special characters. Encoding..." -ForegroundColor Yellow
        
        # URL encode the password
        $encodedPassword = [System.Web.HttpUtility]::UrlEncode($password)
        
        # Replace password in connection string
        $connectionString = $connectionString -replace "://([^:]+):([^@]+)@", "://`$1:$encodedPassword@"
        
        Write-Host "✅ Password URL-encoded" -ForegroundColor Green
    }
}

# Add pgbouncer parameter if not present
if ($connectionString -notmatch "pgbouncer=true") {
    $separator = if ($connectionString -match "\?") { "&" } else { "?" }
    $connectionString = "$connectionString${separator}pgbouncer=true&connect_timeout=15"
    Write-Host "✅ Added pgbouncer=true parameter" -ForegroundColor Green
}

# Read current .env.local
$envContent = Get-Content ".env.local" -ErrorAction SilentlyContinue

# Update or add DATABASE_URL
$updated = $false
$newContent = @()

foreach ($line in $envContent) {
    if ($line -match "^DATABASE_URL=") {
        $newContent += "DATABASE_URL=`"$connectionString`""
        $updated = $true
    } else {
        $newContent += $line
    }
}

if (-not $updated) {
    $newContent += "DATABASE_URL=`"$connectionString`""
}

# Write back to .env.local
$newContent | Set-Content ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ Updated DATABASE_URL in .env.local" -ForegroundColor Green
Write-Host ""

# Test the connection
Write-Host "Testing database connection..." -ForegroundColor Cyan
$testResult = node scripts/test-db-connection.js 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCESS! Database connection is working!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart your dev server (Ctrl+C, then 'npm run dev')" -ForegroundColor White
    Write-Host "  2. Try logging in or creating an account" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Connection still failing. Please check:" -ForegroundColor Red
    Write-Host "  1. The connection string is correct" -ForegroundColor White
    Write-Host "  2. The project ID matches your Supabase project" -ForegroundColor White
    Write-Host "  3. The password is correct" -ForegroundColor White
    Write-Host "  4. Your Supabase project is active (not paused)" -ForegroundColor White
    Write-Host ""
    Write-Host "If the issue persists, try:" -ForegroundColor Yellow
    Write-Host "  1. Resetting your database password in Supabase" -ForegroundColor White
    Write-Host "  2. Getting a fresh connection string" -ForegroundColor White
    Write-Host "  3. Checking if your Supabase project is paused" -ForegroundColor White
}


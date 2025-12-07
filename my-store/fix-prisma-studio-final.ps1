# Final Fix for Prisma Studio - Complete Reset
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Prisma Studio - Complete Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check .env.local
Write-Host "Step 1: Checking .env.local..." -ForegroundColor Yellow
if (-not (Test-Path .env.local)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ .env.local exists" -ForegroundColor Green

# Step 2: Load environment variables
Write-Host ""
Write-Host "Step 2: Loading environment variables..." -ForegroundColor Yellow
$envContent = Get-Content .env.local -Raw -Encoding UTF8
$lines = $envContent -split "`r?`n"

foreach ($line in $lines) {
    $line = $line.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $equalIndex = $line.IndexOf("=")
        if ($equalIndex -gt 0) {
            $key = $line.Substring(0, $equalIndex).Trim()
            $value = $line.Substring($equalIndex + 1).Trim()
            
            # Remove quotes
            if (($value.StartsWith('"') -and $value.EndsWith('"')) -or 
                ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL not found in .env.local" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Environment variables loaded" -ForegroundColor Green

# Step 3: Verify database connection
Write-Host ""
Write-Host "Step 3: Verifying database connection..." -ForegroundColor Yellow
node scripts/verify-tables.js
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Database verification failed!" -ForegroundColor Red
    Write-Host "Please check your DATABASE_URL and try again." -ForegroundColor Yellow
    exit 1
}

# Step 4: Regenerate Prisma Client
Write-Host ""
Write-Host "Step 4: Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client regenerated" -ForegroundColor Green

# Step 5: Start Prisma Studio
Write-Host ""
Write-Host "Step 5: Starting Prisma Studio..." -ForegroundColor Yellow
Write-Host "Browser will open at: http://localhost:5555" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop Prisma Studio" -ForegroundColor Gray
Write-Host ""

npx prisma studio


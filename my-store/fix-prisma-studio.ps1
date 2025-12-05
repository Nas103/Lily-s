# Fix Prisma Studio - Load environment variables from .env.local

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Prisma Studio with Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "ERROR: .env.local file not found" -ForegroundColor Red
    exit 1
}

Write-Host "Loading environment variables from .env.local..." -ForegroundColor Yellow

# Read and parse .env.local
$envContent = Get-Content .env.local -Raw
$lines = $envContent -split "`r?`n"

foreach ($line in $lines) {
    $line = $line.Trim()
    # Skip comments and empty lines
    if ($line -and -not $line.StartsWith("#")) {
        $equalIndex = $line.IndexOf("=")
        if ($equalIndex -gt 0) {
            $key = $line.Substring(0, $equalIndex).Trim()
            $value = $line.Substring($equalIndex + 1).Trim()
            
            # Remove quotes if present
            if (($value.StartsWith('"') -and $value.EndsWith('"')) -or 
                ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            
            # Set environment variable
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

Write-Host "Environment variables loaded!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Prisma Studio..." -ForegroundColor Cyan
Write-Host "Browser will open at: http://localhost:5555" -ForegroundColor Gray
Write-Host ""

# Start Prisma Studio
npx prisma studio


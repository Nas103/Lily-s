# Check Vercel Environment Variables
# This script helps verify what environment variables were created

Write-Host "Checking Vercel Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "To check your environment variables:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Via Vercel Dashboard" -ForegroundColor Yellow
Write-Host "  1. Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Select your project" -ForegroundColor White
Write-Host "  3. Go to Settings -> Environment Variables" -ForegroundColor White
Write-Host "  4. Look for variables like:" -ForegroundColor White
Write-Host "     - DATABASE_URL or POSTGRES_URL" -ForegroundColor Gray
Write-Host "     - SUPABASE_URL" -ForegroundColor Gray
Write-Host "     - SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host "     - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Pull environment variables locally" -ForegroundColor Yellow
Write-Host "  Run: vercel env pull .env.local" -ForegroundColor White
Write-Host "  This will download all environment variables to .env.local" -ForegroundColor Gray
Write-Host ""

$pull = Read-Host "Do you want to pull environment variables now? (y/n)"
if ($pull -eq "y") {
    Write-Host ""
    Write-Host "Pulling environment variables..." -ForegroundColor Cyan
    vercel env pull .env.local
    Write-Host ""
    Write-Host "Environment variables pulled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Checking what was created..." -ForegroundColor Cyan
    
    if (Test-Path .env.local) {
        $envContent = Get-Content .env.local
        $dbVars = $envContent | Where-Object { $_ -match "DATABASE|POSTGRES|SUPABASE" }
        
        if ($dbVars) {
            Write-Host ""
            Write-Host "Found database-related variables:" -ForegroundColor Green
            $dbVars | ForEach-Object {
                $line = $_.Split('=')[0]
                Write-Host "  - $line" -ForegroundColor Gray
            }
        } else {
            Write-Host "No database variables found in .env.local" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify DATABASE_URL is set in Vercel" -ForegroundColor White
Write-Host "  2. Run: npx prisma db push (to create tables)" -ForegroundColor White
Write-Host "  3. Redeploy your application" -ForegroundColor White


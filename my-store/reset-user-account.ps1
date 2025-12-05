# Reset User Account - Delete and recreate

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Reset User Account" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Since passwords are hashed, we can't recover the original password." -ForegroundColor Yellow
Write-Host "The best solution is to delete the existing user and create a new account." -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Open Prisma Studio" -ForegroundColor Cyan
Write-Host "In a NEW terminal window (keep your dev server running), run:" -ForegroundColor White
Write-Host ""
Write-Host "  npx prisma studio" -ForegroundColor Green
Write-Host ""
Write-Host "This will open a browser at http://localhost:5555" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 2: Delete the User" -ForegroundColor Cyan
Write-Host "1. In Prisma Studio, click on 'User' table" -ForegroundColor White
Write-Host "2. Find the user with email: nascode.dev@gmail.com" -ForegroundColor White
Write-Host "3. Click the delete button (trash icon) on that row" -ForegroundColor White
Write-Host "4. Confirm the deletion" -ForegroundColor White
Write-Host ""

Write-Host "Step 3: Create New Account" -ForegroundColor Cyan
Write-Host "1. Go back to your app: http://localhost:3000/login" -ForegroundColor White
Write-Host "2. Click 'Need an account?' to switch to register mode" -ForegroundColor White
Write-Host "3. Enter:" -ForegroundColor White
Write-Host "   Email: nascode.dev@gmail.com" -ForegroundColor Gray
Write-Host "   Password: (choose any password you want)" -ForegroundColor Gray
Write-Host "4. Click 'Create account'" -ForegroundColor White
Write-Host ""

Write-Host "That's it! You'll now have a new account with a password you know." -ForegroundColor Green
Write-Host ""


# Script to delete a user from the database
# This allows you to create a new account with the same email

Write-Host "Delete User from Database" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will help you delete the existing user so you can create a new account." -ForegroundColor Yellow
Write-Host ""

$email = Read-Host "Enter the email to delete (or press Enter for nascode.dev@gmail.com)"

if ([string]::IsNullOrWhiteSpace($email)) {
    $email = "nascode.dev@gmail.com"
}

Write-Host ""
Write-Host "To delete the user, you have two options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Using Prisma Studio (Recommended)" -ForegroundColor Yellow
Write-Host "1. Run: npx prisma studio" -ForegroundColor White
Write-Host "2. Wait for browser to open" -ForegroundColor Gray
Write-Host "3. Click on 'User' table" -ForegroundColor Gray
Write-Host "4. Find the user with email: $email" -ForegroundColor Gray
Write-Host "5. Click the delete button (trash icon)" -ForegroundColor Gray
Write-Host "6. Confirm deletion" -ForegroundColor Gray
Write-Host "7. Then create a new account in your app" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 2: Using SQL (Advanced)" -ForegroundColor Yellow
Write-Host "You can connect to Supabase and run:" -ForegroundColor White
Write-Host "DELETE FROM \"User\" WHERE email = '$email';" -ForegroundColor Gray
Write-Host ""

Write-Host "After deleting, you can:" -ForegroundColor Cyan
Write-Host "- Create a new account with the same email" -ForegroundColor White
Write-Host "- Use any password you want" -ForegroundColor White
Write-Host ""


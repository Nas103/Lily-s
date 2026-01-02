# Setup Checklist

Use this checklist to ensure everything is working correctly.

## ✅ Backend Setup

- [x] Next.js backend is running (`npm run dev` in `my-store/`)
- [x] Backend accessible at `http://localhost:3000`
- [x] Products API endpoint working (`/api/products` returns data)
- [x] Authentication API endpoints working (`/api/auth/login`, `/api/auth/register`)
- [x] CSRF middleware allows mobile app requests
- [ ] Database configured (`.env.local` has `DATABASE_URL`) - *Check if using static products*
- [ ] Prisma schema pushed (`npx prisma db push`) - *Only if using database*

## ✅ Mobile App Setup

- [x] Dependencies installed (`npm install` in `mobile-app/`)
- [x] API URL configured in `src/config/api.ts`
- [x] Android emulator: `http://10.0.2.2:3000` ✅
- [x] iOS simulator: `http://localhost:3000` ✅
- [x] Physical device: Update with computer's IP when needed
- [x] Error handling improved for network issues
- [x] Products API handles response format correctly

## ✅ Testing Authentication

- [x] Login/Register API endpoints configured
- [x] Error handling improved with clear messages
- [x] CSRF protection allows mobile requests
- [x] Secure storage for user credentials (expo-secure-store)
- [ ] **TEST**: Can sign up with new email
- [ ] **TEST**: Can sign in with existing credentials
- [ ] **TEST**: Error messages display correctly
- [ ] **TEST**: User stays logged in after app restart

## ✅ Testing Products

- [x] Products API endpoint configured
- [x] Handles both array and object response formats
- [x] Loading states implemented
- [x] Error handling with user-friendly messages
- [x] Currency conversion support (from backend)
- [ ] **TEST**: Products load on home screen
- [ ] **TEST**: Products load in categories screen
- [ ] **TEST**: Can browse by category
- [ ] **TEST**: Product images display
- [ ] **TEST**: Prices show correctly

## ✅ Testing Cart

- [x] Cart store implemented with Zustand
- [x] Persistent storage with AsyncStorage
- [x] Add/remove/update quantity functions
- [x] Total calculation
- [ ] **TEST**: Can add items to cart
- [ ] **TEST**: Cart persists after app restart
- [ ] **TEST**: Can update quantities
- [ ] **TEST**: Can remove items
- [ ] **TEST**: Cart total calculates correctly

## ✅ Testing Checkout

- [x] Checkout screen implemented
- [x] Delivery addresses API configured
- [x] Payment methods API configured
- [x] Checkout API endpoint configured
- [x] Order summary display
- [ ] **TEST**: Can proceed to checkout
- [ ] **TEST**: Delivery addresses load (if logged in)
- [ ] **TEST**: Can place order
- [ ] **TEST**: Order confirmation appears

## ✅ Testing Profile

- [x] Profile screen implemented
- [x] Profile API endpoints configured
- [x] Profile update functionality
- [x] Password change API configured
- [ ] **TEST**: Can view profile
- [ ] **TEST**: Can update profile information
- [ ] **TEST**: Profile image displays (if set)

## ✅ Additional Features

- [x] AI Chat screen implemented
- [x] AI Chat API endpoint configured (uses same OpenAI key as web)
- [x] Wishlist screen (placeholder)
- [x] Orders screen (placeholder)
- [x] Design system matching web app (colors, theme)
- [x] Responsive layouts for all screen sizes
- [x] Navigation structure (tabs + stack)
- [x] Error handling throughout app

## Common Issues

### Backend Not Running
```bash
cd my-store
npm run dev
```

### Database Not Configured
```bash
# Check .env.local exists
# Run: npx prisma db push
```

### API Connection Issues
- Check `src/config/api.ts` has correct URL
- For physical device, use computer's IP
- Ensure phone and computer on same WiFi

### Products Not Loading
- Verify backend: `http://localhost:3000/api/products`
- Check API URL in mobile app config
- Clear cache: `npm start --clear`

## Next Steps

Once everything works:
1. Test all features thoroughly
2. Update API URL for production
3. Build for app stores
4. Submit to Google Play and App Store


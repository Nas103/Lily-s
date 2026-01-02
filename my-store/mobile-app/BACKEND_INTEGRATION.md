# Backend Integration Guide

## ✅ Mobile App Uses Same Backend as Web App

The mobile app is fully integrated with your existing Next.js backend. Here's what's shared:

### 🔗 Shared Components

1. **Same Database**
   - Uses the same PostgreSQL database via Prisma
   - Same schema, same data
   - All user accounts, products, orders are shared

2. **Same API Endpoints**
   - All API routes in `/api/*` are used by both web and mobile
   - Authentication, products, cart, checkout, profile - all shared

3. **Same OpenAI Configuration**
   - Mobile app uses `/api/ai-chat` endpoint
   - Same OpenAI API key from `.env.local`
   - Same AI assistant behavior

4. **Same Products**
   - Products come from `/api/products` endpoint
   - Uses same product data from `src/data/products.ts`
   - Same currency conversion logic

5. **Same Design System**
   - Matching color scheme (black/white/zinc)
   - Same typography and spacing
   - Consistent user experience

### 📱 Mobile App Configuration

The mobile app connects to your backend via `src/config/api.ts`:

```typescript
// For development:
// - Android emulator: http://10.0.2.2:3000
// - iOS simulator: http://localhost:3000
// - Physical device: http://YOUR_COMPUTER_IP:3000

// For production:
// Update to your deployed Next.js URL
export const API_BASE_URL = 'https://your-production-domain.com';
```

### 🔑 Environment Variables

The mobile app doesn't need its own environment variables. All API keys and configuration are handled by your Next.js backend:

- ✅ `OPENAI_API_KEY` - Used by backend `/api/ai-chat`
- ✅ `DATABASE_URL` - Used by backend Prisma
- ✅ `PAYFAST_*` - Used by backend checkout
- ✅ All other keys - Managed by backend

### 🎨 Design Matching

The mobile app uses the same design system:

- **Colors**: Black (#000000), White (#ffffff), Zinc palette
- **Typography**: System fonts with matching letter spacing
- **Layout**: Same spacing and border radius values
- **Components**: Matching button styles, cards, etc.

### 🚀 Deployment

When deploying:

1. **Backend**: Deploy your Next.js app (Vercel, etc.)
2. **Mobile**: Update `API_BASE_URL` in `src/config/api.ts` to production URL
3. **Database**: Same database for both web and mobile
4. **API Keys**: All managed in backend `.env` files

### 📊 Data Flow

```
Mobile App → API Request → Next.js Backend → Database
                                    ↓
                            OpenAI API (for AI chat)
                                    ↓
                            PayFast (for payments)
```

### ✅ What's Already Working

- ✅ User authentication (login/register)
- ✅ Product browsing (same products as web)
- ✅ Shopping cart (shared state via API)
- ✅ User profiles (same database)
- ✅ AI chat (same OpenAI integration)
- ✅ Currency conversion (same logic)
- ✅ Checkout flow (same PayFast integration)

### 🔄 Real-time Sync

Since both apps use the same backend:
- User logs in on web → Can access same account on mobile
- Add to cart on mobile → Cart persists across devices
- Update profile on web → Changes visible on mobile
- Place order on mobile → Shows in web order history

Everything is synchronized because they share the same database and APIs!


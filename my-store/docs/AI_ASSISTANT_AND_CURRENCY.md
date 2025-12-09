# AI Assistant & Currency Conversion Features

## Overview

Enhanced AI shopping assistant with OpenAI integration and automatic currency conversion based on user's saved address.

## ✅ AI Assistant Enhancements

### 1. OpenAI Integration (When Available)
- **Comprehensive System Prompt**: AI understands retail context, products, shipping, returns, sizing, payments
- **Intelligent Responses**: Can answer questions about:
  - Product information and recommendations
  - Shipping and delivery times
  - Returns and exchanges
  - Sizing and fit
  - Payment methods
  - General store information
  - Styling advice

### 2. Fallback System (When OpenAI Not Available)
- **Rule-Based Responses**: Provides helpful answers for common questions
- **Keyword Matching**: Recognizes shipping, perfumes, returns, sizing, payment, products, greetings, help
- **Always Helpful**: Never shows "not configured" errors to users

### 3. Enhanced System Prompt
The AI is trained to:
- Answer product questions accurately
- Recommend outfits and products
- Provide shipping information
- Help with sizing and fit
- Explain return policies
- Assist with payment methods
- Never hallucinate features
- Be concise and friendly

## ✅ Currency Conversion Feature

### 1. Automatic Detection
- **User's Country**: Detected from:
  - Profile country field
  - Default delivery address
  - Falls back to ZAR (South African Rand) if not set

### 2. Supported Currencies
- **ZAR** (South African Rand) - Base currency
- **USD** (US Dollar)
- **GBP** (British Pound)
- **CAD** (Canadian Dollar)
- **AUD** (Australian Dollar)
- **NGN** (Nigerian Naira)
- **KES** (Kenyan Shilling)
- **GHS** (Ghanaian Cedi)
- **EUR** (Euro)

### 3. Price Display
- **Product Cards**: Show converted prices
- **Product Detail Modal**: Shows converted price
- **Cart Summary**: All prices in user's currency
- **Automatic Updates**: Prices update when user saves/changes address

### 4. Implementation
- **`useCurrency` Hook**: React hook to get user's currency
- **`currency.ts` Utility**: Conversion functions and formatting
- **API Integration**: Products API includes currency conversion
- **Client-Side Display**: All price displays use converted prices

## How It Works

### Currency Conversion Flow

1. **User Saves Address**:
   - User adds delivery address with country
   - Country is stored in database

2. **Currency Detection**:
   - `useCurrency` hook fetches user's country
   - Checks profile country first
   - Falls back to default delivery address
   - Determines currency based on country

3. **Price Conversion**:
   - All prices stored in ZAR (base currency)
   - Converted to user's currency on display
   - Exchange rates applied automatically

4. **Display**:
   - Product cards show converted prices
   - Cart shows converted subtotals
   - Product modals show converted prices
   - Currency symbol displayed correctly

## API Enhancements

### `/api/products`
- Now accepts `country` query parameter
- Automatically detects user's country if authenticated
- Returns products with:
  - `price`: Original price in ZAR
  - `convertedPrice`: Converted amount
  - `currency`: Currency code
  - `currencySymbol`: Currency symbol
  - `formattedPrice`: Formatted price string

### `/api/ai-chat`
- Enhanced system prompt for comprehensive answers
- Uses OpenAI when available
- Falls back to rule-based responses
- Handles all retail-related questions

## Components Updated

1. **ProductCard**: Shows converted prices
2. **ProductDetailModal**: Shows converted prices
3. **CartSummary**: Shows converted prices and subtotals
4. **AiChatWidget**: Enhanced with better responses

## Exchange Rates

Exchange rates are stored in `src/lib/currency.ts`. 

**Note**: For production, consider:
- Using a real-time currency API (e.g., exchangerate-api.com, fixer.io)
- Updating rates daily
- Caching rates for performance

## Usage Example

```typescript
// In a component
const { formatPrice, convertPrice, currency, symbol } = useCurrency();

// Convert a price
const converted = convertPrice(500); // 500 ZAR
// Returns: { amount: 27.5, currency: "USD", symbol: "$", formatted: "$27.50" }

// Format a price
const formatted = formatPrice(27.5, "$"); // "$27.50"
```

## Next Steps

1. **Update Exchange Rates**:
   - Integrate with a currency API for real-time rates
   - Update rates daily or on-demand

2. **Add More Currencies**:
   - Add more countries to `EXCHANGE_RATES` object
   - Add currency symbols and codes

3. **Cache Currency**:
   - Store user's currency preference in profile
   - Reduce API calls for currency detection

4. **Price History**:
   - Track price changes in different currencies
   - Show price trends

## Testing

1. **Test Currency Conversion**:
   - Add a delivery address with country (e.g., US)
   - Check product prices show in USD
   - Verify cart shows USD prices

2. **Test AI Assistant**:
   - Ask about shipping → Should get shipping info
   - Ask about perfumes → Should get perfume info
   - Ask general questions → Should get helpful answers
   - With OpenAI: Should get comprehensive AI responses

3. **Test Without Address**:
   - Prices should default to ZAR
   - AI should still work with rule-based responses


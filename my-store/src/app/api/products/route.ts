import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as staticProducts } from '@/data/products'
import { applySecurityMiddleware } from '@/lib/middleware'
import { getUserCurrency, convertPrice } from '@/lib/currency'

const mapStaticProduct = (products: typeof staticProducts) =>
  products.map((product) => ({
    ...product,
    category: {
      name: product.category,
      slug: product.category,
    },
  }))

export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 100, windowMs: 60000 },
    csrf: false,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const country = searchParams.get('country') ?? undefined; // User's country for currency conversion

  // Get user's country from headers if authenticated
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");
  let userCountry: string | null = country || null;

  // If user is authenticated, try to get their country from profile
  if (userId && userEmail && prisma && !userCountry) {
    try {
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { country: true },
      });
      if (user?.country) {
        userCountry = user.country;
      } else {
        // Try to get from default delivery address
        const defaultAddress = await (prisma as any).deliveryAddress.findFirst({
          where: { userId, isDefault: true },
          select: { country: true },
        });
        if (defaultAddress?.country) {
          userCountry = defaultAddress.country;
        }
      }
    } catch (error) {
      // Silently fail, use default currency
    }
  }

  const currency = await getUserCurrency(userCountry);

  if (!process.env.DATABASE_URL || !prisma) {
    const filtered = staticProducts.filter((product) => {
      const matchesCategory = category ? product.category === category : true
      const matchesSearch = search
        ? `${product.name} ${product.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
    
    // Add currency conversion to static products
    const productsWithCurrency = await Promise.all(
      mapStaticProduct(filtered).map(async (product: any) => {
        const priceInZAR = typeof product.price === 'number' ? product.price : parseFloat(product.price);
        const converted = await convertPrice(priceInZAR, userCountry);
        return {
          ...product,
          price: priceInZAR, // Keep original price
          convertedPrice: converted.amount,
          currency: converted.currency,
          currencySymbol: converted.symbol,
          formattedPrice: converted.formatted,
        };
      })
    );
    
    return NextResponse.json(productsWithCurrency);
  }

  const products = await (prisma as any).product.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && {
        category: {
          slug: category,
        },
      }),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!products.length) {
    const filtered = staticProducts.filter((product) => {
      const matchesCategory = category ? product.category === category : true
      const matchesSearch = search
        ? `${product.name} ${product.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    });
    
    const productsWithCurrency = await Promise.all(
      mapStaticProduct(filtered).map(async (product: any) => {
        const priceInUSD = typeof product.price === 'number' ? product.price : parseFloat(product.price);
        // Only convert if user has a country set
        const converted = userCountry ? await convertPrice(priceInUSD, userCountry) : {
          amount: priceInUSD,
          currency: "USD",
          symbol: "$",
          formatted: `$${priceInUSD.toFixed(2)}`,
        };
        return {
          ...product,
          price: priceInUSD,
          convertedPrice: converted.amount,
          currency: converted.currency,
          currencySymbol: converted.symbol,
          formattedPrice: converted.formatted,
        };
      })
    );
    
    return NextResponse.json(productsWithCurrency);
  }

  // Add currency conversion to database products
  // Prices are stored in USD, convert only if user has country set
  const productsWithCurrency = await Promise.all(
    products.map(async (product: any) => {
      const priceInUSD = parseFloat(product.price.toString());
      // Only convert if user has a country set
      const converted = userCountry ? await convertPrice(priceInUSD, userCountry) : {
        amount: priceInUSD,
        currency: "USD",
        symbol: "$",
        formatted: `$${priceInUSD.toFixed(2)}`,
      };
      return {
        ...product,
        price: priceInUSD, // Keep original price in USD
        convertedPrice: converted.amount,
        currency: converted.currency,
        currencySymbol: converted.symbol,
        formattedPrice: converted.formatted,
      };
    })
  );

  return NextResponse.json(productsWithCurrency);
}



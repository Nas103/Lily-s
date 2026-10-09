import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as staticProducts } from '@/data/products'
import { applySecurityMiddleware } from '@/lib/middleware'
import { getUserCurrency, convertPrice } from '@/lib/currency'

// Import new product data
let newProducts: any[] = [];
try {
  const { womenProducts } = await import('../../../../mobile-app/src/data/womenProducts');
  const { menProducts } = await import('../../../../mobile-app/src/data/menProducts');
  const { lifestyleProducts } = await import('../../../../mobile-app/src/data/lifestyleProducts');
  const { runningProducts } = await import('../../../../mobile-app/src/data/runningProducts');
  const { boxrawProducts } = await import('../../../../mobile-app/src/data/boxrawProducts');
  const { electronicsProducts } = await import('../../../../mobile-app/src/data/electronicsProducts');
  const { perfumesProducts } = await import('../../../../mobile-app/src/data/perfumesProducts');
  newProducts = [
    ...(womenProducts || []),
    ...(menProducts || []),
    ...(lifestyleProducts || []),
    ...(runningProducts || []),
    ...(boxrawProducts || []),
    ...(electronicsProducts || []),
    ...(perfumesProducts || []),
  ];
} catch (error) {
  console.warn('[products] Could not load new product data files:', error);
  // Continue without new products if import fails
}

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

  // Derive the origin from the request's Host header instead of
  // request.nextUrl.origin: the dev server runs with `-H 0.0.0.0`, so
  // nextUrl.origin resolves to `http://0.0.0.0:3000` — an address the mobile
  // app (physical device or emulator) cannot connect to for image loads.
  const host = request.headers.get('host');
  const protocol =
    request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');
  const origin = host ? `${protocol}://${host}` : request.nextUrl.origin;

  type ColorImageSet = Record<string, string>;
  type ProductWithImages = {
    id?: string;
    imageUrl: string;
    colorImages?: Record<string, string[] | ColorImageSet>;
    [key: string]: unknown;
  };

  // Convert relative asset paths (e.g. /perfumes/<slug>/main.webp) to absolute
  // URLs so the mobile app can load them via Image source={{ uri }}.
  const rebaseImageUrls = (value: string): string =>
    value.startsWith('/') && !value.startsWith('//') ? `${origin}${value}` : value;
  const rebaseProductImages = (product: ProductWithImages): ProductWithImages => {
    const copy = { ...product };
    copy.imageUrl = rebaseImageUrls(product.imageUrl);
    if (product.colorImages) {
      const colorImages: Record<string, string[] | ColorImageSet> = {};
      for (const [color, images] of Object.entries(product.colorImages)) {
        if (Array.isArray(images)) {
          colorImages[color] = (images as string[]).map(rebaseImageUrls);
        } else if (images && typeof images === 'object') {
          const set: ColorImageSet = {};
          for (const angle of ['front', 'back', 'side', 'top']) {
            const value = (images as ColorImageSet)[angle];
            if (value) set[angle] = rebaseImageUrls(value);
          }
          colorImages[color] = set;
        }
      }
      copy.colorImages = colorImages;
    }
    return copy;
  };

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const subCategory = searchParams.get('subCategory') ?? undefined; // For BoxRaw and Electronics sub-categories
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

  // Helper function to return static products with currency conversion
  const getStaticProducts = async () => {
    // Merge static products with new products, deduplicating by id
    const allProducts = [
      ...new Map(
        [...staticProducts, ...newProducts].map((product) => [product.id, product])
      ).values(),
    ];
    
    const filtered = allProducts.filter((product) => {
      const productCategory = typeof product.category === 'string' 
        ? product.category 
        : product.category?.name || product.category?.slug || '';
      const matchesCategory = category ? productCategory === category : true;
      const matchesSubCategory = subCategory && product.subCategory 
        ? product.subCategory === subCategory 
        : true;
      const matchesSearch = search
        ? `${product.name} ${product.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSubCategory && matchesSearch;
    });
    
    // Map products to consistent format
    const mappedProducts = filtered.map((product: any) => {
      // If product already has category object, use it; otherwise create one
      const categoryObj = typeof product.category === 'string'
        ? { name: product.category, slug: product.category }
        : product.category || { name: 'other', slug: 'other' };
      
      return {
        ...rebaseProductImages(product),
        category: categoryObj,
      };
    });
    
    // Add currency conversion to products
    const productsWithCurrency = await Promise.all(
      mappedProducts.map(async (product: any) => {
        const priceInUSD = typeof product.price === 'number' ? product.price : parseFloat(product.price);
        const converted = userCountry ? await convertPrice(priceInUSD, userCountry) : {
          amount: priceInUSD,
          currency: "USD",
          symbol: "$",
          formatted: `$${priceInUSD.toFixed(2)}`,
        };
        return {
          ...product,
          price: priceInUSD, // Keep original price
          convertedPrice: converted.amount,
          currency: converted.currency,
          currencySymbol: converted.symbol,
          formattedPrice: converted.formatted,
        };
      })
    );
    
    return productsWithCurrency;
  };

  // If no database, use static products
  if (!process.env.DATABASE_URL || !prisma) {
    const productsWithCurrency = await getStaticProducts();
    return NextResponse.json(productsWithCurrency);
  }

  // Try to get products from database, fallback to static if it fails
  let products;
  try {
    products = await (prisma as any).product.findMany({
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
    });
  } catch (error) {
    // Database connection failed, fallback to static products
    console.warn('[products] Database query failed, using static products:', error);
    const productsWithCurrency = await getStaticProducts();
    return NextResponse.json(productsWithCurrency);
  }

  if (!products.length) {
    // Use static products (which now includes new products)
    const productsWithCurrency = await getStaticProducts();
    return NextResponse.json(productsWithCurrency);
  }

  // Add currency conversion to database products
  // Prices are stored in USD, convert only if user has country set
  // (Discount pricing is intentionally not applied; a custom discount system
  // will be implemented separately.)
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
        ...rebaseProductImages(product),
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



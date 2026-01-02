import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as staticProducts } from '@/data/products'
import { applySecurityMiddleware } from '@/lib/middleware'
import { getUserCurrency, convertPrice } from '@/lib/currency'

// Import new product data
let newProducts: any[] = [];
try {
  const { lifestyleProducts } = await import('../../../../mobile-app/src/data/lifestyleProducts');
  const { runningProducts } = await import('../../../../mobile-app/src/data/runningProducts');
  const { boxrawProducts } = await import('../../../../mobile-app/src/data/boxrawProducts');
  const { electronicsProducts } = await import('../../../../mobile-app/src/data/electronicsProducts');
  newProducts = [
    ...(lifestyleProducts || []),
    ...(runningProducts || []),
    ...(boxrawProducts || []),
    ...(electronicsProducts || []),
  ];
} catch (error) {
  console.warn('[products] Could not load new product data files:', error);
  // Continue without new products if import fails
}

// Discount logic: Random discounts on max 9 products from different categories
const DISCOUNT_PERCENTAGES = [10, 15, 20, 25, 30];
const MAX_DISCOUNTED_PRODUCTS = 9;

function applyRandomDiscounts(products: any[]): any[] {
  // Group products by category
  const categoryGroups: Record<string, any[]> = {};
  products.forEach((product) => {
    const categoryName = typeof product.category === 'string' 
      ? product.category 
      : product.category?.name || product.category?.slug || 'other';
    if (!categoryGroups[categoryName]) {
      categoryGroups[categoryName] = [];
    }
    categoryGroups[categoryName].push(product);
  });

  // Select products for discounts (max 9, distributed across categories)
  const discountedProductIds = new Set<string>();
  const categories = Object.keys(categoryGroups);
  let totalDiscounted = 0;

  // Distribute discounts across categories
  for (const category of categories) {
    if (totalDiscounted >= MAX_DISCOUNTED_PRODUCTS) break;
    
    const categoryProducts = categoryGroups[category];
    const productsToDiscount = Math.min(
      Math.ceil((MAX_DISCOUNTED_PRODUCTS - totalDiscounted) / (categories.length - Object.keys(discountedProductIds).length)),
      categoryProducts.length
    );

    // Randomly select products from this category
    const shuffled = [...categoryProducts].sort(() => Math.random() - 0.5);
    for (let i = 0; i < productsToDiscount && totalDiscounted < MAX_DISCOUNTED_PRODUCTS; i++) {
      const product = shuffled[i];
      if (product?.id && !discountedProductIds.has(product.id)) {
        discountedProductIds.add(product.id);
        totalDiscounted++;
      }
    }
  }

  // Apply random discounts
  return products.map((product) => {
    if (discountedProductIds.has(product.id)) {
      const discountPercent = DISCOUNT_PERCENTAGES[Math.floor(Math.random() * DISCOUNT_PERCENTAGES.length)];
      return {
        ...product,
        discountPercent,
      };
    }
    return product;
  });
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
    // Merge static products with new products
    const allProducts = [...staticProducts, ...newProducts];
    
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
        ...product,
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
    const productsWithDiscounts = applyRandomDiscounts(productsWithCurrency);
    return NextResponse.json(productsWithDiscounts);
  }

  // Apply random discounts to database products
  const productsWithDiscounts = applyRandomDiscounts(products);
  
  // Add currency conversion to database products
  // Prices are stored in USD, convert only if user has country set
  const productsWithCurrency = await Promise.all(
    productsWithDiscounts.map(async (product: any) => {
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



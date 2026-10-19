import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as staticProducts } from '@/data/products'
import { applySecurityMiddleware, getPublicOrigin } from '@/lib/middleware'
import { getUserCurrency, convertPrice } from '@/lib/currency'
import { applyOverrides, loadProductOverrides } from '@/lib/productOverrides'
import { resolveUserId } from '@/lib/auth-middleware'

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
  const { featuredProducts } = await import('../../../../mobile-app/src/data/featuredProducts');
  newProducts = [
    ...(womenProducts || []),
    ...(menProducts || []),
    ...(lifestyleProducts || []),
    ...(runningProducts || []),
    ...(boxrawProducts || []),
    ...(electronicsProducts || []),
    ...(perfumesProducts || []),
    ...(featuredProducts || []),
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

  // Build a validated absolute origin for asset URLs. The Host header is used
  // (so mobile devices on the LAN get their reachable address) but sanitized.
  const origin = getPublicOrigin(request);

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

  // Resolve the caller's country from a verified session (never from
  // caller-supplied identity headers) unless an explicit country was passed.
  let userCountry: string | null = country || null;

  if (prisma && !userCountry) {
    const userId = await resolveUserId(request);
    if (userId) {
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
  }

  const currency = await getUserCurrency(userCountry);

  // Load admin name/price overrides once so every returned product reflects
  // the latest admin edits.
  const overrides = await loadProductOverrides();

  // Helper: house catalog from static data files — filter + normalise shape
  // (currency is applied later, once, to the merged list).
  const getStaticProducts = () => {
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
    return filtered.map((product: any) => {
      // If product already has category object, use it; otherwise create one
      const categoryObj = typeof product.category === 'string'
        ? { name: product.category, slug: product.category }
        : product.category || { name: 'other', slug: 'other' };
      
      return {
        ...rebaseProductImages(product),
        category: categoryObj,
      };
    });
  };

  // Marketplace (database) products: brand-owned rows plus any admin-created
  // DB rows. NEVER replaces the house catalog — merged below so the static
  // storefront keeps working once brands start publishing.
  // Returns [] when there is no database or the query fails (house catalog
  // alone is always a valid response).
  const getDbProducts = async (): Promise<any[]> => {
    if (!process.env.DATABASE_URL || !prisma) return [];
    try {
      const rows = await (prisma as any).product.findMany({
        where: {
          status: 'ACTIVE',
          AND: [
            // Brand products only surface while the brand is approved.
            { OR: [{ brandId: null }, { brand: { status: 'APPROVED' } }] },
            ...(search
              ? [{
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                  ],
                }]
              : []),
            ...(category ? [{ category: { slug: category } }] : []),
            ...(subCategory ? [{ subCategory }] : []),
          ],
        },
        include: {
          category: true,
          brand: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return rows.map((product: any) => {
        const { brand, ...rest } = product;
        return {
          ...rebaseProductImages({
            ...rest,
            // Serialize the relation as the free-text label the storefront
            // expects (mobile Product.brand is a string, not an object).
            brand: brand?.name ?? undefined,
            price: parseFloat(product.price.toString()),
            discountPercent: product.discountPercent
              ? parseFloat(product.discountPercent.toString())
              : null,
          }),
          category: product.category,
        };
      });
    } catch (error) {
      // Database connection failed: serve the house catalog alone.
      console.warn('[products] Database query failed, using house catalog:', error);
      return [];
    }
  };

  const houseProducts = getStaticProducts();
  const dbProducts = await getDbProducts();

  // Later sources win on id collision — matches loadCatalog() so the price
  // charged at checkout is the price shown here.
  const mergedProducts = [
    ...new Map(
      [...houseProducts, ...dbProducts].map((product) => [product.id, product])
    ).values(),
  ];

  // Apply admin overrides (keyed by static catalog id) and currency conversion.
  const overriddenProducts = applyOverrides(mergedProducts as any[], overrides);
  const productsWithCurrency = await Promise.all(
    overriddenProducts.map(async (product: any) => {
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



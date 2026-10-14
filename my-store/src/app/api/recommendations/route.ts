import { NextRequest, NextResponse } from "next/server";
import { applySecurityMiddleware, getPublicOrigin } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/auth-middleware";
import { convertPrice } from "@/lib/currency";
import {
  catalogProducts,
  getCatalogProduct,
  type CatalogProduct,
} from "@/data/catalog";
import { BRAND } from "@/lib/brand";
import { openrouter, isOpenRouterConfigured, OPENROUTER_MODEL } from "@/lib/openrouter";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 24;
const AI_CANDIDATE_CAP = 60;

const norm = (value?: string | null) => (value || "").trim().toLowerCase();

type CartItemInput = {
  id?: string;
  productId?: string;
  name?: string;
  brand?: string;
  category?: string | { name?: string; slug?: string };
  product?: { name?: string };
};

type ResolvedCartItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
};

function resolveCartItem(item: CartItemInput): ResolvedCartItem {
  const id = item.id || item.productId || "";
  const product = id ? getCatalogProduct(id) : undefined;
  const category =
    typeof item.category === "string"
      ? item.category
      : item.category?.slug || item.category?.name;

  return {
    id,
    name: item.name || item.product?.name || product?.name || "",
    brand: item.brand || product?.brand || "",
    category: category || product?.category || "",
  };
}

/**
 * POST /api/recommendations
 *
 * Recommends products based on the user's cart. Candidates are strictly
 * limited to products that share a brand OR a category with at least one
 * cart item, then ranked by the AI (when configured) or by a deterministic
 * brand-first / category-second score.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 30, windowMs: 60000 },
    csrf: false,
    securityHeaders: true,
  });

  if (securityResponse) {
    return securityResponse;
  }

  try {
    const body = await request.json();
    const rawLimit = Number(body?.limit);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(1, Math.floor(rawLimit)), MAX_LIMIT)
      : DEFAULT_LIMIT;

    const cartItems: CartItemInput[] = Array.isArray(body?.cartItems)
      ? body.cartItems
      : [];

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    const resolved = cartItems.map(resolveCartItem).filter((item) => item.id);
    const cartIds = new Set(resolved.map((item) => item.id));
    const cartBrands = new Set(
      resolved.map((item) => norm(item.brand)).filter(Boolean)
    );
    const cartCategories = new Set(
      resolved.map((item) => norm(item.category)).filter(Boolean)
    );

    const isSameBrand = (product: CatalogProduct) => {
      const brand = norm(product.brand);
      return brand.length > 0 && cartBrands.has(brand);
    };
    const isSameCategory = (product: CatalogProduct) => {
      const category = norm(product.category);
      return category.length > 0 && cartCategories.has(category);
    };

    // STRICT: only same brand or same category as something in the cart.
    let candidates = catalogProducts.filter(
      (product) =>
        !cartIds.has(product.id) &&
        (isSameBrand(product) || isSameCategory(product))
    );

    // Safety net so the endpoint never comes back empty.
    if (candidates.length === 0) {
      candidates = catalogProducts.filter((product) => !cartIds.has(product.id));
    }

    const rankLocal = (pool: CatalogProduct[]) =>
      [...pool]
        .map((product) => {
          let score = 0;
          if (isSameBrand(product)) score += 2; // same brand wins
          if (isSameCategory(product)) score += 1;
          return { product, score };
        })
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.product);

    let recommended = await rankWithAI(candidates, resolved, limit);

    if (!recommended || recommended.length === 0) {
      recommended = rankLocal(candidates).slice(0, limit);
    } else if (recommended.length < limit) {
      const chosen = new Set(recommended.map((product) => product.id));
      const filler = rankLocal(candidates).filter(
        (product) => !chosen.has(product.id)
      );
      recommended = [...recommended, ...filler].slice(0, limit);
    }

    const country = await resolveCountry(request);

    // Build a validated absolute origin for asset URLs (mirrors /api/products):
    // relative asset paths must be absolute for the mobile app, whose
    // Image source={{ uri }} cannot resolve paths like /perfumes/<slug>/main.webp.
    const origin = getPublicOrigin(request);

    const rebaseImageUrls = (value: string): string =>
      value.startsWith("/") && !value.startsWith("//") ? `${origin}${value}` : value;

    const rebaseColorImages = (
      colorImages: CatalogProduct["colorImages"]
    ): CatalogProduct["colorImages"] => {
      if (!colorImages) return colorImages;
      const result: Record<string, string[]> = {};
      for (const [color, images] of Object.entries(colorImages)) {
        result[color] = images.map(rebaseImageUrls);
      }
      return result;
    };

    const productsWithCurrency = await Promise.all(
      recommended.map(async (product) => {
        const priceInUSD = Number(product.price) || 0;

        const converted = country
          ? await convertPrice(priceInUSD, country)
          : {
              amount: priceInUSD,
              currency: "USD",
              symbol: "$",
              formatted: `$${priceInUSD.toFixed(2)}`,
            };

        return {
          ...product,
          imageUrl: rebaseImageUrls(product.imageUrl),
          colorImages: rebaseColorImages(product.colorImages),
          price: priceInUSD,
          convertedPrice: converted.amount,
          currency: converted.currency,
          currencySymbol: converted.symbol,
          formattedPrice: converted.formatted,
          brand: product.brand ?? null,
          category: { name: product.category, slug: product.category },
        };
      })
    );

    return NextResponse.json({
      recommendations: productsWithCurrency,
      count: productsWithCurrency.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[recommendations] Error:", message);
    return NextResponse.json(
      { error: "Failed to get recommendations", message },
      { status: 500 }
    );
  }
}

/**
 * Resolve the country used for currency conversion: an explicit
 * `x-user-country` header or `?country=` query wins, otherwise fall back to
 * the authenticated user's saved country (or their default address) resolved
 * from a verified session — never from caller-supplied identity headers.
 */
async function resolveCountry(request: NextRequest): Promise<string | null> {
  const explicit =
    request.headers.get("x-user-country") ||
    new URL(request.url).searchParams.get("country");
  if (explicit) return explicit;

  if (!prisma) return null;
  const userId = await resolveUserId(request);
  if (!userId) return null;

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    if (user?.country) return user.country;

    const defaultAddress = await (prisma as any).deliveryAddress.findFirst({
      where: { userId, isDefault: true },
      select: { country: true },
    });
    return defaultAddress?.country ?? null;
  } catch {
    return null;
  }
}

/**
 * Ask the AI to order the (already brand/category-constrained) candidate pool.
 * Returns null when AI is unavailable or fails, so the caller falls back to
 * the deterministic ranking.
 */
async function rankWithAI(
  candidates: CatalogProduct[],
  cart: ResolvedCartItem[],
  limit: number
): Promise<CatalogProduct[] | null> {
  if (!openrouter || !isOpenRouterConfigured() || candidates.length === 0) {
    return null;
  }

  const subset = candidates.slice(0, AI_CANDIDATE_CAP);
  const byId = new Map(subset.map((product) => [product.id, product]));

  const systemPrompt = `You are a product recommendation assistant for ${BRAND.name}, a premium fashion brand.
A shopper has added items to their cart. Recommend up to ${limit} complementary products.
STRICT RULES:
- Only choose product IDs from the provided candidate list. Never invent IDs.
- Strongly prefer products that share the SAME brand as a cart item.
- If no same-brand products exist, choose products from the SAME category as a cart item.
- Do not recommend products already in the cart.
Return ONLY a JSON array of product IDs in order of relevance, e.g. ["id1","id2"].`;

  const summary = subset.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand ?? null,
    category: product.category,
  }));

  const userPrompt = `Cart items: ${JSON.stringify(cart)}
Candidates: ${JSON.stringify(summary)}
Recommend up to ${limit} products.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const text = completion.choices[0]?.message?.content || "";
    let ids: string[] = [];

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) ids = parsed.filter((id) => typeof id === "string");
    } catch {
      const matches = text.match(/"([^"]+)"/g);
      if (matches) ids = matches.map((match) => match.replace(/"/g, ""));
    }

    // Only trust IDs that exist in the constrained pool.
    const seen = new Set<string>();
    const picked: CatalogProduct[] = [];
    for (const id of ids) {
      const product = byId.get(id);
      if (product && !seen.has(id)) {
        seen.add(id);
        picked.push(product);
      }
    }

    return picked.slice(0, limit);
  } catch (error: unknown) {
    console.error(
      "[recommendations] AI ranking failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

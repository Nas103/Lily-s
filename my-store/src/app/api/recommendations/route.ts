import { NextRequest, NextResponse } from "next/server";
import { applySecurityMiddleware } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { products as staticProducts } from "@/data/products";
import { getUserCurrency, convertPrice } from "@/lib/currency";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * POST /api/recommendations - Get AI-powered product recommendations
 * Based on cart items or product categories
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
    const { cartItems, categories, limit = 10 } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Extract categories from cart items
    const cartCategories = categories || cartItems.map((item: any) => {
      if (typeof item.category === 'string') return item.category;
      return item.category?.name || item.category?.slug || 'other';
    }).filter(Boolean);

    // Get user's country for currency conversion
    const country = request.headers.get("x-user-country") || 
                    new URL(request.url).searchParams.get("country") || 
                    null;

    // Fetch all products
    let allProducts: any[] = [];
    
    if (prisma) {
      try {
        const dbProducts = await (prisma as any).product.findMany({
          where: {
            category: {
              in: cartCategories,
            },
          },
          take: 50, // Get more products to filter from
        });
        allProducts = dbProducts;
      } catch (error) {
        console.error("[recommendations] Database error, using static products:", error);
      }
    }

    // Fallback to static products if database is empty
    if (allProducts.length === 0) {
      allProducts = staticProducts.filter((product) =>
        cartCategories.includes(product.category)
      );
    }

    // Use AI to recommend products if OpenAI is available
    let recommendedProducts: any[] = [];
    
    if (openai && allProducts.length > 0) {
      try {
        const cartItemsSummary = cartItems.map((item: any) => ({
          name: item.name || item.product?.name,
          category: typeof item.category === 'string' 
            ? item.category 
            : item.category?.name || item.category?.slug,
        }));

        const systemPrompt = `You are a product recommendation assistant for Lily Atelier, a premium fashion brand.
Given a user's cart items, recommend ${limit} related products that would complement their purchase.
Consider:
- Similar style or category
- Items that pair well together
- Popular combinations
- Different price points within the same category
Return ONLY a JSON array of product IDs in order of relevance, like: ["id1", "id2", "id3"]`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Cart items: ${JSON.stringify(cartItemsSummary)}\n\nAvailable product IDs: ${allProducts.map(p => p.id).join(", ")}\n\nRecommend ${limit} products.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        });

        const responseText = completion.choices[0]?.message?.content || "";
        let recommendedIds: string[] = [];
        
        try {
          recommendedIds = JSON.parse(responseText);
        } catch {
          // Fallback: extract IDs from text
          const idMatches = responseText.match(/"([^"]+)"/g);
          if (idMatches) {
            recommendedIds = idMatches.map(m => m.replace(/"/g, ''));
          }
        }

        // Get recommended products in order
        recommendedProducts = recommendedIds
          .map((id) => allProducts.find((p) => p.id === id))
          .filter(Boolean)
          .slice(0, limit);
      } catch (error) {
        console.error("[recommendations] OpenAI error:", error);
      }
    }

    // Fallback: Random products from same categories if AI fails
    if (recommendedProducts.length === 0) {
      const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
      recommendedProducts = shuffled
        .filter((p) => !cartItems.some((item: any) => item.id === p.id || item.productId === p.id))
        .slice(0, limit);
    }

    // Add currency conversion
    const productsWithCurrency = await Promise.all(
      recommendedProducts.map(async (product: any) => {
        const priceInUSD = typeof product.price === 'number' 
          ? product.price 
          : parseFloat(product.price?.toString() || '0');
        
        const converted = country ? await convertPrice(priceInUSD, country) : {
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
          category: typeof product.category === 'string' 
            ? { name: product.category, slug: product.category }
            : product.category,
        };
      })
    );

    return NextResponse.json({
      recommendations: productsWithCurrency,
      count: productsWithCurrency.length,
    });
  } catch (error: any) {
    console.error("[recommendations] Error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations", message: error.message },
      { status: 500 }
    );
  }
}


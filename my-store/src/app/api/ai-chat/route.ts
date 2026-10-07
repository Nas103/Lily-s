import { NextRequest, NextResponse } from "next/server";
import { applySecurityMiddleware } from "@/lib/middleware";
import { BRAND } from "@/lib/brand";
import { catalogProducts, CATEGORY_META } from "@/data/catalog";
import { openrouter, OPENROUTER_MODEL, isOpenRouterConfigured } from "@/lib/openrouter";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

/**
 * Compact, human-readable snapshot of the live catalog so the assistant can
 * talk about real products, categories, and prices instead of guessing.
 */
const CATALOG_CONTEXT = (() => {
  const lines: string[] = [];
  for (const meta of CATEGORY_META) {
    const items = catalogProducts.filter((product) => product.category === meta.id);
    if (!items.length) continue;
    lines.push(`\n## ${meta.label} (${meta.blurb}) — /${meta.id}`);
    for (const product of items) {
      const bits = [`- ${product.name} — $${product.price.toFixed(2)}`];
      if (product.gender) bits.push(`(${product.gender})`);
      if (product.subCategory) bits.push(`[${product.subCategory}]`);
      if (product.tags?.length) bits.push(`tags: ${product.tags.slice(0, 5).join(", ")}`);
      bits.push(`link: /product/${product.slug}`);
      lines.push(bits.join(" "));
    }
  }
  return lines.join("\n");
})();

const SYSTEM_PROMPT =
  `You are ${BRAND.name}'s AI shopping assistant — a warm, knowledgeable personal stylist and product expert for the ${BRAND.name} online store.\n\n` +
  `BRAND: ${BRAND.name} (${BRAND.description}). ${BRAND.tagline}. ` +
  "We sell curated fashion and lifestyle collections across Men, Women, Abaya, Perfumes, Lifestyle, Running, BoxRaw, and Electronics.\n\n" +
  "WHAT YOU DO:\n" +
  "• Freely hold natural, flowing conversations — greet people, ask what they're looking for, and keep the dialogue going.\n" +
  "• Give ideas, styling suggestions, outfit pairings, gifting ideas, and thoughtful recommendations.\n" +
  "• Answer anything about what NaSO offers: product names, categories, prices, materials, sizes, colors, and how to find items.\n" +
  "• Quote only real prices from the CATALOG below, in USD.\n" +
  "• Guide customers to the right page, e.g. \"take a look at /running\" or \"view it at /product/<slug>\".\n\n" +
  "RULES:\n" +
  "• Never invent products, prices, stock levels, or policies that are not in the catalog or brand info below.\n" +
  "• If something is not in the catalog, say so and suggest the closest alternatives.\n" +
  "• You do not process payments or handle orders; direct users to checkout or Support for that.\n" +
  "• Be warm, concise, and helpful — use short paragraphs or bullet lists when listing products.\n\n" +
  "SHIPPING & POLICIES:\n" +
  "• Standard shipping 5–7 business days; Express 2–3 business days; free shipping over $75.\n" +
  "• 30-day returns on unworn items with tags attached.\n\n" +
  `LIVE CATALOG (${catalogProducts.length} products):` +
  CATALOG_CONTEXT;

/**
 * Provide helpful responses without AI (rule-based fallback)
 */
function getHelpfulResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  if (message.includes("shipping") || message.includes("delivery") || message.includes("ship")) {
    return "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Shipping is free on orders over $75. You can track your order in the 'Track' section once it's shipped.";
  }

  if (message.includes("perfume") || message.includes("fragrance") || message.includes("scent")) {
    return "We have a curated collection of premium perfumes. Browse our Perfumes section to explore our selection. Each fragrance is carefully selected for quality and longevity.";
  }

  if (message.includes("return") || message.includes("refund") || message.includes("exchange")) {
    return "We offer a 30-day return policy. Items must be unworn, with tags attached. Visit our Support page for detailed return instructions and to initiate a return.";
  }

  if (message.includes("price") || message.includes("cost")) {
    return `Our prices are listed on each product page. For a recommendation at any budget, tell me what you're looking for and I'll suggest options from the ${BRAND.name} catalog.`;
  }

  if (message.includes("hi") || message.includes("hello") || message.includes("hey")) {
    return `Hello! I'm the ${BRAND.name} shopping assistant. I can help you with product questions, sizing, shipping, returns, and styling advice. What would you like to know?`;
  }

  if (message.includes("help") || message.includes("support")) {
    return "I can help with:\n• Product information and sizing\n• Shipping and delivery\n• Returns and exchanges\n• Payment methods\n• Styling advice\n\nVisit our Support page for more detailed help.";
  }

  return "I'm here to help! I can assist with product questions, sizing, shipping information, returns, and more. Feel free to ask me anything about our products or services.";
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 20, windowMs: 60000 }, // 20 requests per minute
    csrf: true,
    securityHeaders: true,
  });

  if (securityResponse) {
    return securityResponse;
  }

  let messages: ChatMessage[] = [];
  let context: { cartTotal?: number; locale?: string } = {};
  let userMessage = "";

  try {
    const body = (await request.json()) as {
      messages: ChatMessage[];
      context?: {
        cartTotal?: number;
        locale?: string;
      };
    };

    messages = body.messages || [];
    context = body.context || {};

    const lastMessage = messages[messages.length - 1];
    userMessage = lastMessage?.content || "";

    if (openrouter && isOpenRouterConfigured()) {
      const systemPrompt: ChatMessage = {
        role: "system",
        content: SYSTEM_PROMPT,
      };

      try {
        const completion = await openrouter.chat.completions.create({
          model: OPENROUTER_MODEL,
          messages: [systemPrompt, ...messages],
          temperature: 0.8,
          max_tokens: 1200,
        });

        const answer =
          completion.choices[0]?.message?.content?.trim() ||
          getHelpfulResponse(userMessage);

        return NextResponse.json({
          reply: answer,
          context,
        });
      } catch (aiError: any) {
        console.error("[ai-chat] OpenRouter error:", aiError?.message || aiError);
        return NextResponse.json({
          reply: getHelpfulResponse(userMessage),
          context,
        });
      }
    }

    const reply = getHelpfulResponse(userMessage);

    return NextResponse.json({
      reply,
      context,
    });
  } catch (error: any) {
    console.error("[ai-chat] Error:", error);

    const reply = userMessage
      ? getHelpfulResponse(userMessage)
      : "I'm here to help! I can assist with product questions, sizing, shipping information, returns, and more. Feel free to ask me anything about our products or services.";

    return NextResponse.json({
      reply,
      context: {},
    });
  }
}
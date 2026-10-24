import { NextRequest, NextResponse } from "next/server";
import { applySecurityMiddleware } from "@/lib/middleware";
import { BRAND } from "@/lib/brand";
import { catalogProducts } from "@/data/catalog";
import { openrouter, createChatCompletion, isOpenRouterConfigured } from "@/lib/openrouter";
import { prisma } from "@/lib/prisma";
import { loadProductOverrides } from "@/lib/productOverrides";
import { products as staticProducts } from "@/data/products";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type CatalogProductLike = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  category?: string | { name?: string; slug?: string };
  subCategory?: string | null;
  gender?: string | null;
  price: number | string;
  sizes?: string[] | null;
  colors?: string[] | null;
  brand?: string | null;
  discountPercent?: number | string | null;
  soldOut?: boolean;
  soldOutSizes?: string[] | null;
  soldOutColors?: string[] | null;
};

const normalizePrice = (price: number | string | null | undefined): number => {
  if (price === null || price === undefined) return 0;
  const n = typeof price === "number" ? price : parseFloat(String(price));
  return Number.isFinite(n) ? n : 0;
};

const normalizeArray = (arr?: string[] | null): string[] =>
  Array.isArray(arr) ? arr.filter(Boolean).map((v) => String(v)) : [];

async function buildLiveCatalogContext(): Promise<string> {
  const overrides = await loadProductOverrides();

  let mobileProducts: CatalogProductLike[] = [];
  try {
    const [
      { womenProducts },
      { menProducts },
      { lifestyleProducts },
      { runningProducts },
      { boxrawProducts },
      { electronicsProducts },
      { perfumesProducts },
      { featuredProducts },
    ] = await Promise.all([
      import("../../../../mobile-app/src/data/womenProducts"),
      import("../../../../mobile-app/src/data/menProducts"),
      import("../../../../mobile-app/src/data/lifestyleProducts"),
      import("../../../../mobile-app/src/data/runningProducts"),
      import("../../../../mobile-app/src/data/boxrawProducts"),
      import("../../../../mobile-app/src/data/electronicsProducts"),
      import("../../../../mobile-app/src/data/perfumesProducts"),
      import("../../../../mobile-app/src/data/featuredProducts"),
    ]);
    mobileProducts = [
      ...(womenProducts || []),
      ...(menProducts || []),
      ...(lifestyleProducts || []),
      ...(runningProducts || []),
      ...(boxrawProducts || []),
      ...(electronicsProducts || []),
      ...(perfumesProducts || []),
      ...(featuredProducts || []),
    ] as CatalogProductLike[];
  } catch (error) {
    console.warn("[ai-chat] failed to load mobile catalog", error);
  }

  const merged = new Map<string, CatalogProductLike>();
  for (const product of [
    ...(staticProducts as CatalogProductLike[]),
    ...mobileProducts,
    ...(catalogProducts as CatalogProductLike[]),
  ]) {
    if (!product?.id) continue;
    merged.set(String(product.id), { ...product });
  }

  if (prisma) {
    try {
      const rows = await (prisma as any).product.findMany({
        where: {
          status: "ACTIVE",
          AND: [{ OR: [{ brandId: null }, { brand: { status: "APPROVED" } }] }],
        },
        include: { category: true, brand: true },
      });
      for (const row of rows as any[]) {
        merged.set(String(row.id), {
          id: String(row.id),
          name: row.name,
          slug: row.slug,
          description: row.description,
          category: row.category?.name || row.category?.slug || null,
          subCategory: row.subCategory || null,
          gender: row.gender || null,
          price: row.price,
          sizes: Array.isArray(row.sizes) ? row.sizes : [],
          colors: Array.isArray(row.colors) ? row.colors : [],
          brand: row.brand?.name || null,
          discountPercent: row.discountPercent || null,
        });
      }
    } catch (error) {
      console.warn("[ai-chat] failed to load DB products", error);
    }
  }

  const lines: string[] = [];
  for (const [id, product] of merged) {
    const ov = overrides.get(id);
    const basePrice = normalizePrice(ov?.price ?? product.price);
    const discount = normalizePrice(ov?.discountPercent ?? product.discountPercent);
    const price = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
    const name = ov?.name ?? product.name;
    const category =
      typeof product.category === "string"
        ? product.category
        : product.category?.name || product.category?.slug || "";
    const subCategory = (product.subCategory as string) || "";
    const gender = (product.gender as string) || "";
    const sizes = normalizeArray(ov?.soldOutSizes ? undefined : product.sizes);
    const colors = normalizeArray(product.colors);
    const soldOutSizes = normalizeArray(ov?.soldOutSizes as any);
    const soldOutColors = normalizeArray(ov?.soldOutColors as any);

    const bits = [`${name} $${price.toFixed(2)}`];
    if (gender) bits.push(`(${gender})`);
    if (category) bits.push(`[${category}${subCategory ? "/" + subCategory : ""}]`);
    if (product.brand) bits.push(`{${product.brand}}`);
    lines.push(`- ${bits.join(" ")}`);
    if (sizes.length || colors.length) {
      const parts: string[] = [];
      if (sizes.length) parts.push(`sizes: ${sizes.join(", ")}`);
      if (colors.length) parts.push(`colors: ${colors.join(", ")}`);
      if (soldOutSizes.length) parts.push(`sold out sizes: ${soldOutSizes.join(", ")}`);
      if (soldOutColors.length) parts.push(`sold out colors: ${soldOutColors.join(", ")}`);
      lines.push(`  ${parts.join(" | ")}`);
    }
  }

  return `LIVE CATALOG (${merged.size} products, synced from catalog + DB + admin overrides):\n${lines.join("\n")}`;
}

function buildSystemPrompt(catalogContext: string) {
  return (
    `You are ${BRAND.name}'s AI shopping assistant — a warm, knowledgeable personal stylist and product expert for the ${BRAND.name} online store.\n\n` +
    `BRAND: ${BRAND.name} (${BRAND.description}). ${BRAND.tagline}. ` +
    "We sell curated fashion and lifestyle collections across Men, Women, Featured, Perfumes, Lifestyle, Running, BoxRaw, and Electronics.\n\n" +
    "WHAT YOU DO:\n" +
    "• Before replying, quietly reason about the shopper's goal, occasion, budget, the weather or setting, and which catalog items actually fit. Use that reasoning to choose your answer, but never reveal your private working steps — give only the finished, polished recommendation.\n" +
    "• Freely hold natural, flowing conversations — greet people, ask what they're looking for, and keep the dialogue going.\n" +
    "• Give ideas, styling suggestions, outfit pairings, gifting ideas, and thoughtful recommendations.\n" +
    "• Answer anything about what NaSO offers: product names, categories, prices, sizes, colors, materials, and how to find items.\n" +
    "• Always use the LIVE CATALOG below. It includes all products from the storefront including brand products, with exact prices, sizes, colors, and sold-out variants. This data is updated in real-time when admins or brands update products.\n" +
    "• Quote only real prices from the CATALOG below, in USD.\n" +
    "• Guide customers to the right page, e.g. \"take a look at /running\" or \"view it at /product/<slug>\".\n\n" +
    "RULES:\n" +
    "• Never invent products, prices, stock levels, sizes, or policies that are not in the catalog below.\n" +
    "• If something is not in the catalog, say so and suggest the closest alternatives from the catalog.\n" +
    "• You do not process payments or handle orders; direct users to checkout or Support for that.\n" +
    "• Be warm, concise, and helpful. Use short paragraphs.\n\n" +
    "FORMATTING (VERY IMPORTANT):\n" +
    "• Reply in plain, natural conversational text ONLY. Never use Markdown.\n" +
    "• Do NOT use asterisks, # or headings, backticks, or [text](link) syntax.\n" +
    "• Do NOT wrap product names in symbols. Write them normally.\n" +
    "• To list a few options, put each on its own line starting with a simple hyphen.\n" +
    "• Never output raw URLs. If you must point somewhere, say it in words.\n\n" +
    "SHIPPING & POLICIES:\n" +
    "• Standard shipping 5–7 business days; Express 2–3 business days; free shipping over $75.\n" +
    "• 30-day returns on unworn items with tags attached.\n\n" +
    catalogContext
  );
}

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

/**
 * Safety net: flatten any Markdown the model still produces into plain text,
 * since the chat UIs render messages as plain text.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/(^|[^_])_([^_\n]+)_/g, "$1$2")
    .replace(/^\s*[-*+]\s+/gm, "- ")
    .replace(/^\s*>\s?/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * OpenAI/OpenRouter SDK errors expose `status` and `message`; unknown throws
 * (network failures) do not. Normalize both into something loggable.
 */
function describeError(error: unknown): { status?: number; message: string } {
  if (error && typeof error === "object") {
    const candidate = error as { status?: unknown; message?: unknown };
    const status =
      typeof candidate.status === "number" ? candidate.status : undefined;
    const message =
      typeof candidate.message === "string"
        ? candidate.message
        : String(error);
    return { status, message };
  }
  return { message: String(error) };
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
      const catalogContext = await buildLiveCatalogContext();
      const systemPrompt: ChatMessage = {
        role: "system",
        content: buildSystemPrompt(catalogContext),
      };

      let answer = "";

      try {
        const completion = await createChatCompletion({
          messages: [systemPrompt, ...messages],
          temperature: 0.8,
          max_tokens: 900,
        });
        answer = stripMarkdown(completion.content);
        console.info(`[ai-chat] answered with ${completion.model}`);
      } catch (aiError: unknown) {
        console.warn(
          "[ai-chat] OpenRouter failed:",
          describeError(aiError).message
        );
        answer = getHelpfulResponse(userMessage);
      }

      return NextResponse.json({
        reply: answer,
        context,
      });
    }

    const reply = getHelpfulResponse(userMessage);

    return NextResponse.json({
      reply,
      context,
    });
  } catch (error: unknown) {
    console.error("[ai-chat] Error:", describeError(error).message);

    const reply = userMessage
      ? getHelpfulResponse(userMessage)
      : "I'm here to help! I can assist with product questions, sizing, shipping information, returns, and more. Feel free to ask me anything about our products or services.";

    return NextResponse.json({
      reply,
      context: {},
    });
  }
}
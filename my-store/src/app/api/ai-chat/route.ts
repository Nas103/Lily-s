import { NextRequest, NextResponse } from "next/server";
import { applySecurityMiddleware } from "@/lib/middleware";
import { BRAND } from "@/lib/brand";
import { openrouter, createChatCompletion, isOpenRouterConfigured } from "@/lib/openrouter";
import { prisma } from "@/lib/prisma";
import { getAllKnowledgeEntries, searchKnowledge } from "@/lib/ai-knowledge/store";
import { syncKnowledgeLibrary } from "@/lib/ai-knowledge/sync";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

let cachedKnowledgeContext: { text: string; at: number } | null = null;

async function buildKnowledgeContext(query: string): Promise<string> {
  const now = Date.now();
  if (!query && cachedKnowledgeContext && now - cachedKnowledgeContext.at < 60_000) {
    return cachedKnowledgeContext.text;
  }
  let entries = query ? await searchKnowledge(query, 100) : await getAllKnowledgeEntries();
  if (!entries.length) {
    try {
      await syncKnowledgeLibrary("ai-chat-auto");
      entries = query ? await searchKnowledge(query, 100) : await getAllKnowledgeEntries();
    } catch {}
  }

  // Queries such as "gift ideas under R1000" often do not contain a product
  // name or catalog tag, so a keyword search can return only policy entries
  // (or nothing). Never send the model an empty catalog and ask it to make a
  // recommendation: that is how plausible-but-nonexistent products appear.
  if (!entries.some((entry) => entry.sourceType === "product")) {
    const allEntries = await getAllKnowledgeEntries();
    const catalogEntries = allEntries.filter((entry) => entry.sourceType === "product");
    entries = [...entries, ...catalogEntries].filter(
      (entry, index, list) => list.findIndex((candidate) => candidate.id === entry.id) === index
    );
  }
  const lines: string[] = [];
  for (const entry of entries) {
    const meta = entry.metadata || {};
    let content = entry.content || "";
    if (entry.sourceType === "product") {
      const slug = entry.slug || (entry.productId ? `/product/${entry.productId}` : null);
      if (slug && !content.includes("URL:")) {
        content = content.replace(new RegExp(`Product: ${entry.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), `Product: ${entry.title}\nURL: ${slug.startsWith("/") ? slug : "/product/" + slug}`);
      }
    }
    lines.push(`=== ${entry.sourceType.toUpperCase()}: ${entry.title} ===`);
    lines.push(content);
    if (meta.sizes?.length) lines.push(`SIZES:${meta.sizes.join("|")}`);
    if (meta.colors?.length) lines.push(`COLORS:${meta.colors.join("|")}`);
    if (meta.price) lines.push(`PRICE:${meta.price}`);
    lines.push("");
  }
  const text = `LIVE STORE DATA (${entries.length} records). Product records below are the complete allowed catalog for this reply; they are not examples and must not be supplemented with outside knowledge:\n\n${lines.join("\n")}`;
  if (!query) cachedKnowledgeContext = { text, at: now };
  return text;
}

function buildSystemPrompt(knowledgeContext: string) {
  return (
    `You are ${BRAND.name}'s AI shopping assistant — a warm, knowledgeable personal stylist and product expert for the ${BRAND.name} online store.\n\n` +
    `BRAND: ${BRAND.name} (${BRAND.description}). ${BRAND.tagline}. ` +
    "We sell curated fashion and lifestyle collections across Men, Women, Featured, Perfumes, Lifestyle, Running, BoxRaw, and Electronics.\n\n" +
    "WHAT YOU DO:\n" +
    "• Treat the LIVE STORE DATA below as the sole source of truth for every product recommendation. It is not background training material.\n" +
    "• Freely hold natural, flowing conversations — greet people, ask what they're looking for, and keep the dialogue going.\n" +
    "• Give ideas, styling suggestions, outfit pairings, gifting ideas, and thoughtful recommendations based only on actual product records in the LIVE STORE DATA.\n" +
    "• Answer anything about NaSO: product names, categories, prices, sizes, colors, brands, materials, and how to find items.\n" +
    "• When recommending products as answers to clients, ALWAYS turn the product name into a clickable link within the chat by appending the product URL path in parentheses immediately after the product name. Example: Nike Air Max (/product/nike-air-max).\n" +
    "• Quote only real prices from the library, in USD.\n" +
    "• Guide customers to the right page.\n\n" +
    "RULES:\n" +
    "• Never name, imply, compare, or recommend a product unless its exact product record appears in the LIVE STORE DATA for this reply. Never use product knowledge from the conversation, your training, or another retailer.\n" +
    "• If there is no matching product record, say that no matching item is currently listed and offer to help the shopper browse a listed category. Do not fill the gap with an example product.\n" +
    "• You do not process payments or handle orders; direct users to checkout or Support for that.\n" +
    "• Be warm, concise, and helpful. Use short paragraphs.\n\n" +
    "FORMATTING (VERY IMPORTANT):\n" +
    "• Reply in plain, natural conversational text ONLY. Never use Markdown link syntax [text](url).\n" +
    "• DO put product names as links by writing: Product Name (/product/slug) with the path in parentheses.\n" +
    "• Do NOT use asterisks, # or headings, backticks.\n" +
    "• To list options, put each on its own line starting with a simple hyphen.\n\n" +
    "SHIPPING & POLICIES:\n" +
    "• Standard shipping 5–7 business days; Express 2–3 business days; free shipping over $75.\n" +
    "• 30-day returns on unworn items with tags attached.\n\n" +
    knowledgeContext
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
      const knowledgeContext = await buildKnowledgeContext(userMessage);
      const systemPrompt: ChatMessage = {
        role: "system",
        content: buildSystemPrompt(knowledgeContext),
      };

      let answer = "";

      try {
        const completion = await createChatCompletion({
          messages: [systemPrompt, ...messages],
          // Catalog answers need consistency, not creative invention.
          temperature: 0.2,
          max_tokens: 1000,
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

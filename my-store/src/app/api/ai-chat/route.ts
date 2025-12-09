import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { applySecurityMiddleware } from "@/lib/middleware";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

// Only create OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Provide helpful responses without AI (rule-based fallback)
 */
function getHelpfulResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  // Shipping questions
  if (message.includes("shipping") || message.includes("delivery") || message.includes("ship")) {
    return "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Shipping is free on orders over R500. You can track your order in the 'Track' section once it's shipped.";
  }

  // Perfumes/fragrances
  if (message.includes("perfume") || message.includes("fragrance") || message.includes("scent")) {
    return "We have a curated collection of premium perfumes. Browse our Perfumes section to explore our selection. Each fragrance is carefully selected for quality and longevity.";
  }

  // Returns/refunds
  if (message.includes("return") || message.includes("refund") || message.includes("exchange")) {
    return "We offer a 30-day return policy. Items must be unworn, with tags attached. Visit our Support page for detailed return instructions and to initiate a return.";
  }

  // Sizing
  if (message.includes("size") || message.includes("fit") || message.includes("measurement")) {
    return "Size guides are available on each product page. If you need help finding your size, check the product description for detailed measurements. We're happy to help you find the perfect fit!";
  }

  // Payment
  if (message.includes("payment") || message.includes("pay") || message.includes("checkout")) {
    return "We accept all major credit cards and secure payment methods. You can add payment methods in your Profile settings. All transactions are secure and encrypted.";
  }

  // Products/catalog
  if (message.includes("product") || message.includes("item") || message.includes("catalog")) {
    return "Browse our collections: Men, Women, Perfumes, and Abaya. Each product page has detailed descriptions, images, and size information. Use the search or navigation to find what you're looking for.";
  }

  // General greeting
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hello! I'm Lily's shopping assistant. I can help you with product questions, sizing, shipping, returns, and styling advice. What would you like to know?";
  }

  // Help
  if (message.includes("help") || message.includes("support")) {
    return "I can help with:\n• Product information and sizing\n• Shipping and delivery\n• Returns and exchanges\n• Payment methods\n• Styling advice\n\nVisit our Support page for more detailed help.";
  }

  // Default helpful response
  return "I'm here to help! I can assist with product questions, sizing, shipping information, returns, and more. Feel free to ask me anything about our products or services. For detailed support, visit our Support page.";
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware
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

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    userMessage = lastMessage?.content || "";

    // If OpenAI is configured, use it for comprehensive answers
    if (openai && process.env.OPENAI_API_KEY) {
      // Build comprehensive system prompt with store information
      const systemPrompt: ChatMessage = {
        role: "system",
        content:
          "You are Lily Atelier's AI shopping assistant, an expert in fashion, retail, and customer service. " +
          "Your role is to help customers with:\n" +
          "• Product information, recommendations, and styling advice\n" +
          "• Shipping and delivery questions (standard: 5-7 days, express: 2-3 days, free over R500)\n" +
          "• Returns and exchanges (30-day policy, unworn with tags)\n" +
          "• Sizing and fit questions\n" +
          "• Payment methods and checkout assistance\n" +
          "• General store information\n\n" +
          "Guidelines:\n" +
          "- Be friendly, helpful, and professional\n" +
          "- Provide accurate information about products, shipping, and policies\n" +
          "- Recommend products based on customer needs\n" +
          "- Never make up product features or prices\n" +
          "- If unsure, direct customers to browse the catalog or contact support\n" +
          "- You do NOT process payments or handle transactions\n" +
          "- Keep responses concise but informative\n" +
          "- Our collections include: Men, Women, Perfumes, and Abaya",
      };

      try {
        const chat = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [systemPrompt, ...messages],
          temperature: 0.7,
          max_tokens: 500,
        });

        const answer =
          chat.choices[0]?.message?.content ??
          getHelpfulResponse(userMessage); // Fallback to rule-based

        return NextResponse.json({
          reply: answer,
          context,
        });
      } catch (openaiError: any) {
        console.error("[ai-chat] OpenAI error:", openaiError);
        // Fallback to rule-based responses if OpenAI fails
        const reply = getHelpfulResponse(userMessage);
        return NextResponse.json({
          reply: reply,
          context,
        });
      }
    }

    // Fallback: Provide helpful rule-based responses
    const reply = getHelpfulResponse(userMessage);

    return NextResponse.json({
      reply,
      context,
    });
  } catch (error: any) {
    console.error("[ai-chat] Error:", error);
    
    // Provide helpful fallback even on errors
    const reply = userMessage 
      ? getHelpfulResponse(userMessage)
      : "I'm here to help! I can assist with product questions, sizing, shipping information, returns, and more. Feel free to ask me anything about our products or services.";
    
    return NextResponse.json({
      reply,
      context: {},
    });
  }
}


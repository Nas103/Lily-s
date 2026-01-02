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

    // If OpenAI is configured, use advanced AI with reasoning capabilities
    if (openai && process.env.OPENAI_API_KEY) {
      // Build comprehensive system prompt with brand identity and reasoning capabilities
      const systemPrompt: ChatMessage = {
        role: "system",
        content:
          "You are Lily Atelier's advanced AI shopping assistant, powered by cutting-edge reasoning and learning capabilities. " +
          "You embody the essence of Lily Atelier: a premium fashion brand that represents sophistication, innovation, quality, and timeless elegance.\n\n" +
          
          "BRAND IDENTITY:\n" +
          "• Lily Atelier is a premium fashion atelier specializing in curated collections\n" +
          "• We offer: Men's wear, Women's wear, Premium Perfumes, and Abaya collections\n" +
          "• Our philosophy: 'New textures, future silhouettes, and iconic perfumes'\n" +
          "• We value: Quality craftsmanship, innovative design, sustainable fashion, and personalized service\n" +
          "• Style: Contemporary elegance, minimalist sophistication, and statement pieces\n\n" +
          
          "YOUR CAPABILITIES:\n" +
          "You have advanced reasoning and learning abilities similar to GPT-4.1:\n" +
          "• Deep reasoning: Analyze customer needs, preferences, and context to provide thoughtful recommendations\n" +
          "• Learning: Remember conversation context, adapt to customer style preferences, and learn from interactions\n" +
          "• Innovation: Suggest creative styling combinations, trend insights, and personalized fashion advice\n" +
          "• Brand expertise: Understand fashion trends, fabric quality, fit, and how to style our collections\n" +
          "• Problem-solving: Help customers find the perfect pieces, solve sizing issues, and provide styling solutions\n\n" +
          
          "YOUR ROLE:\n" +
          "• Product recommendations: Suggest items based on style, occasion, budget, and preferences\n" +
          "• Styling advice: Create complete looks, suggest color combinations, and provide fashion tips\n" +
          "• Product information: Detailed knowledge about materials, fit, care instructions, and features\n" +
          "• Shipping & delivery: Standard (5-7 days), Express (2-3 days), Free shipping over R500\n" +
          "• Returns & exchanges: 30-day policy, items must be unworn with tags\n" +
          "• Sizing assistance: Help customers find their perfect fit\n" +
          "• Payment support: Guide through checkout and payment methods\n" +
          "• General inquiries: Answer questions about the brand, collections, and policies\n\n" +
          
          "COMMUNICATION STYLE:\n" +
          "• Be warm, sophisticated, and knowledgeable - like a personal stylist\n" +
          "• Show genuine interest in helping customers find their perfect style\n" +
          "• Use fashion terminology appropriately but remain accessible\n" +
          "• Be creative and innovative in your suggestions\n" +
          "• Remember previous conversation context and build on it\n" +
          "• Provide detailed, thoughtful responses that demonstrate deep understanding\n\n" +
          
          "IMPORTANT GUIDELINES:\n" +
          "• Always reason through customer needs before making recommendations\n" +
          "• Learn from the conversation: remember style preferences, sizes, and past interactions\n" +
          "• Be innovative: suggest unique combinations and creative styling ideas\n" +
          "• Never invent product features, prices, or availability - if unsure, direct to catalog\n" +
          "• You do NOT process payments or handle transactions\n" +
          "• Provide comprehensive, well-reasoned responses (not just brief answers)\n" +
          "• Show your reasoning process when making recommendations\n" +
          "• Adapt your communication style to match the customer's level of fashion knowledge",
      };

      try {
        const chat = await openai.chat.completions.create({
          model: "gpt-4o", // Upgraded to GPT-4o for advanced reasoning and learning capabilities
          messages: [systemPrompt, ...messages],
          temperature: 0.8, // Balanced: allows creativity while maintaining reasoning
          max_tokens: 1000, // Increased for more comprehensive, detailed responses
          top_p: 0.9, // Nucleus sampling for better quality
          frequency_penalty: 0.3, // Encourage variety and innovation
          presence_penalty: 0.3, // Encourage exploring new topics
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


import { NextResponse } from "next/server";
import OpenAI from "openai";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

// Only create OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: Request) {
  const { messages, context } = (await request.json()) as {
    messages: ChatMessage[];
    context?: {
      cartTotal?: number;
      locale?: string;
    };
  };

  if (!openai || !process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        reply:
          "AI assistant is not configured yet. Please add an OpenAI API key.",
        context,
      },
      { status: 200 }
    );
  }

  const systemPrompt: ChatMessage = {
    role: "system",
    content:
      "You are Lily Atelier's AI shopping assistant. Answer product questions, recommend outfits, and upsell relevant items. " +
      "Be concise, friendly, and never hallucinate features that do not exist. You do not process payments.",
  };

  const chat = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [systemPrompt, ...messages],
    temperature: 0.6,
  });

  const answer =
    chat.choices[0]?.message?.content ??
    "I'm here to help with sizing, styling, and product questions.";

  return NextResponse.json({
    reply: answer,
    context,
  });
}


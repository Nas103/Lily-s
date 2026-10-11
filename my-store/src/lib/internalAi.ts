import Anthropic from "@anthropic-ai/sdk";
import { BRAND } from "@/lib/brand";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

export async function runInternalClaudeTooling(prompt: string) {
  if (!anthropic) {
    return "Claude for internal tools is not configured – add ANTHROPIC_API_KEY.";
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      system:
        `You are an internal operations assistant for ${BRAND.name}. ` +
        "You help staff with analytics, dashboards, merchandising, and fraud-review workflows. " +
        "Never talk directly to customers.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content?.[0];
    if (content && content.type === "text") {
      return content.text;
    }

    return "No response from Claude.";
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? (error as { status?: number }).status
        : undefined;
    if (status === 401) {
      console.warn("[internalAi] Invalid or missing ANTHROPIC_API_KEY.");
      return (
        "Claude could not be reached because the configured ANTHROPIC_API_KEY " +
        "is missing or invalid. Add a valid key to .env.local to enable fraud-risk summaries."
      );
    }
    console.error("[internalAi] Claude tool call failed:", error);
    return "Claude is unavailable right now. Try again in a moment.";
  }
}



import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

export async function runInternalClaudeTooling(prompt: string) {
  if (!anthropic) {
    return "Claude for internal tools is not configured – add ANTHROPIC_API_KEY.";
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 512,
    system:
      "You are an internal operations assistant for Lily Atelier. " +
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
}



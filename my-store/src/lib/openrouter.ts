import OpenAI from "openai";
import { BRAND } from "@/lib/brand";
import { getSiteUrl } from "@/lib/siteUrl";

const apiKey = process.env.OPENROUTER_API_KEY;
const siteUrl = getSiteUrl();

/**
 * Reasoning-capable free model used when OPENROUTER_MODEL is unset, plus
 * fallbacks for when a provider retires a model slug (which returns a 404)
 * or a free model is rate-limited.
 */
const DEFAULT_MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";
const FALLBACK_MODELS = [
  "openai/gpt-4o-mini",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
];

const configuredModel = process.env.OPENROUTER_MODEL?.trim();

export const OPENROUTER_MODELS = Array.from(
  new Set([configuredModel || DEFAULT_MODEL, ...FALLBACK_MODELS].filter(Boolean))
);
export const OPENROUTER_MODEL = OPENROUTER_MODELS[0];

/**
 * OpenRouter exposes an OpenAI-compatible API, so we reuse the OpenAI SDK
 * pointed at OpenRouter's base URL and add the required attribution headers.
 */
export const openrouter = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": siteUrl,
        "X-Title": BRAND.name,
      },
    })
  : null;

export function isOpenRouterConfigured(): boolean {
  return Boolean(apiKey);
}

type ChatParams = Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  "model"
>;

export type ChatCompletionResult = {
  content: string;
  model: string;
};

function isRetryableStatus(status: number | undefined): boolean {
  return status === undefined || status === 429 || status >= 500;
}

function errorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

/**
 * Create a chat completion, walking the configured model list until one
 * answers. Retired slugs (404), missing credit (402) and other terminal
 * client errors move straight to the next model; 429/5xx get one retry.
 */
export async function createChatCompletion(
  params: ChatParams
): Promise<ChatCompletionResult> {
  if (!openrouter) {
    throw new Error("OpenRouter is not configured.");
  }

  let lastError: unknown = null;

  for (const model of OPENROUTER_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const completion = await openrouter.chat.completions.create({
          ...params,
          model,
        });
        const message = completion.choices?.[0]?.message as
          | (typeof completion.choices[number]["message"] & { reasoning?: string })
          | undefined;
        const content = (message?.content ?? "").trim();
        if (content) {
          return { content, model };
        }
        // Reasoning models occasionally leave their answer in `reasoning` with
        // an empty `content`; salvage it rather than dropping the turn.
        const reasoning = (message?.reasoning ?? "").trim();
        if (reasoning) {
          return { content: reasoning, model };
        }
        lastError = new Error(`Empty response from ${model}.`);
        break;
      } catch (error: unknown) {
        lastError = error;
        const status = errorStatus(error);
        if (!isRetryableStatus(status) || attempt === 1) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All OpenRouter models failed.");
}

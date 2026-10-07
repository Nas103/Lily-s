import OpenAI from "openai";
import { BRAND } from "@/lib/brand";

const apiKey = process.env.OPENROUTER_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o";

export const OPENROUTER_MODEL = model;

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
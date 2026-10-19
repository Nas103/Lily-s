import OpenAI from "openai";
import { BRAND } from "@/lib/brand";
import { getSiteUrl } from "@/lib/siteUrl";

const apiKey = process.env.OPENROUTER_API_KEY;
const siteUrl = getSiteUrl();
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
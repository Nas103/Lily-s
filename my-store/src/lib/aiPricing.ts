import OpenAI from "openai";

export type PricingContext = {
  basePrice: number;
  currency: string;
  countryCode?: string;
  region?: string;
  ipAddress?: string;
  demandScore?: number;
  inventoryLevel?: number;
  isSalePeriod?: boolean;
};

export type DynamicPriceResult = {
  price: number;
  reason?: string;
};

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function getDynamicPrice(
  context: PricingContext
): Promise<DynamicPriceResult> {
  if (!openai) {
    // Safe default: static pricing when OpenAI is not configured.
    return {
      price: context.basePrice,
      reason: "Static pricing – OpenAI not configured.",
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a pricing assistant for a fashion e‑commerce store. " +
            "Given context about base price, country, demand, inventory and seasonality, " +
            "you may adjust the price slightly to optimise conversion and margin. " +
            "Return ONLY a short JSON object like {\"price\": 999.99, \"reason\": \"...\"}.",
        },
        {
          role: "user",
          content: JSON.stringify(context),
        },
      ],
      max_tokens: 120,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    let parsed: Partial<DynamicPriceResult> | null = null;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    return {
      price:
        parsed && typeof parsed.price === "number"
          ? parsed.price
          : context.basePrice,
      reason: parsed?.reason ?? "OpenAI pricing response.",
    };
  } catch {
    return {
      price: context.basePrice,
      reason: "Fallback to base price due to OpenAI error.",
    };
  }
}

export type FraudSignal = {
  reason: string;
  severity: "low" | "medium" | "high";
};

export type FraudAssessment = {
  riskScore: number; // 0–100
  signals: FraudSignal[];
  recommendReview: boolean;
  recommendBlock: boolean;
};

export type OrderContext = {
  orderId: string;
  total: number;
  currency: string;
  ipAddress?: string;
  countryCode?: string;
  attemptsFromIp?: number;
  cardLast4?: string;
};

export async function assessOrderRisk(
  context: OrderContext
): Promise<FraudAssessment> {
  if (!openai) {
    // Safe default: do not auto-block when AI is not configured.
    return {
      riskScore: 5,
      signals: [
        {
          reason: "Fraud engine not configured – OpenAI API key missing.",
          severity: "low",
        },
      ],
      recommendReview: false,
      recommendBlock: false,
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are a risk-scoring assistant for e‑commerce orders. " +
            "Given context, respond ONLY with a JSON object like " +
            '{"riskScore": 0-100, "signals":[{"reason":"...", "severity":"low|medium|high"}], ' +
            '"recommendReview": true|false, "recommendBlock": true|false}. ' +
            "Be conservative about blocking: prefer recommending review over blocking.",
        },
        {
          role: "user",
          content: JSON.stringify(context),
        },
      ],
      max_tokens: 180,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    let parsed: Partial<FraudAssessment> | null = null;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    return {
      riskScore:
        parsed && typeof parsed.riskScore === "number"
          ? parsed.riskScore
          : 5,
      signals:
        parsed?.signals && parsed.signals.length
          ? parsed.signals
          : [
              {
                reason: "OpenAI fraud response with no explicit signals.",
                severity: "low",
              },
            ],
      recommendReview: parsed?.recommendReview ?? false,
      recommendBlock: parsed?.recommendBlock ?? false,
    };
  } catch {
    return {
      riskScore: 5,
      signals: [
        {
          reason: "Fraud engine fallback – OpenAI error.",
          severity: "low",
        },
      ],
      recommendReview: false,
      recommendBlock: false,
    };
  }
}



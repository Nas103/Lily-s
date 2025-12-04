import { runInternalClaudeTooling } from "@/lib/internalAi";

export const metadata = {
  title: "Risk Review | Lily Atelier",
};

async function getSummary() {
  // In a real app you would pull suspicious orders from your database
  // and pass a structured prompt. This keeps the template simple.
  const prompt =
    "Summarise today's fraud risk posture for Lily Atelier in 5 bullet points. " +
    "Highlight any patterns that staff should watch for (locations, order sizes, failed attempts). " +
    "End with 2 concrete actions for the fraud-review team.";

  const text = await runInternalClaudeTooling(prompt);
  return text;
}

export default async function RiskReviewPage() {
  const summary = await getSummary();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        Internal tool
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Fraud & risk overview
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Powered by Claude. Intended for staff only – do not expose this page to
        shoppers.
      </p>
      <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap">
        {summary}
      </div>
    </div>
  );
}



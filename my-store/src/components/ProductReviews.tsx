"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useAuth } from "@/stores/authStore";

type Review = {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  createdAt: string;
  userName: string;
  userId: string;
};

type Summary = {
  count: number;
  average: number;
  distribution: { stars: number; count: number }[];
};

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(value)
              ? "fill-zinc-900 text-zinc-900"
              : "text-zinc-300"
          }
        />
      ))}
    </span>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const user = useAuth((state) => state.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (!res.ok) return;
      const data = await res.json();
      setReviews(data.reviews || []);
      setSummary(data.summary || null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mt-8 border-t border-zinc-100 pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Reviews
        </h3>
        {summary && summary.count > 0 && (
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Stars value={summary.average} />
            <span className="font-semibold text-zinc-900">
              {summary.average.toFixed(1)}
            </span>
            <span>({summary.count})</span>
          </div>
        )}
      </div>

      {user ? (
        <ReviewForm productId={productId} onSubmitted={load} />
      ) : (
        <p className="mt-4 text-sm text-zinc-500">
          <a href="/login" className="underline underline-offset-4">
            Sign in
          </a>{" "}
          to write a review.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-6 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : reviews.length ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-zinc-100 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stars value={review.rating} />
                  <span className="text-sm font-medium text-zinc-900">
                    {review.userName}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.title && (
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  {review.title}
                </p>
              )}
              {review.body && (
                <p className="mt-1 text-sm text-zinc-600">{review.body}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">
            No reviews yet. Be the first to share your thoughts.
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save review");
      setTitle("");
      setBody("");
      setDone(true);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-4 space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setRating(star);
              setDone(false);
            }}
            aria-label={`${star} star`}
          >
            <Star
              size={20}
              className={
                star <= rating ? "fill-zinc-900 text-zinc-900" : "text-zinc-300"
              }
            />
          </button>
        ))}
      </div>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Review title (optional)"
        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm"
      />
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Tell others what you think"
        rows={3}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white disabled:opacity-60"
        >
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}
          Submit review
        </button>
        {done && !saving && (
          <span className="text-xs text-emerald-600">Review saved</span>
        )}
      </div>
    </form>
  );
}
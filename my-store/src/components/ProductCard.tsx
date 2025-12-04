import Image from "next/image";
import { AddToCartButton } from "./AddToCartButton";
import { AddToWishlistButton } from "./AddToWishlistButton";
import { QuickBuyButton } from "./QuickBuyButton";

export type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  highlight?: string;
  description?: string;
  badge?: string;
  tags?: string[];
  onPreview?: () => void;
};

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
  highlight,
  badge,
  onPreview,
}: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 transition hover:-translate-y-1 hover:ring-black/10">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        {/* TODO: Update imagery to match each product drop. */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 320px, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            {badge ? (
              <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-900 shadow-sm">
                {badge}
              </span>
            ) : (
              <span />
            )}
            <AddToWishlistButton id={id} name={name} price={price} imageUrl={imageUrl} />
          </div>
          <div className="flex justify-between">
            {category ? (
              <p className="inline-flex w-fit rounded-full bg-black/70 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.35em] text-white backdrop-blur">
                {category}
              </p>
            ) : (
              <span />
            )}
            {onPreview ? (
              <button
                onClick={onPreview}
                className="rounded-full bg-white/80 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-900 backdrop-blur transition hover:bg-white"
              >
                View
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-5 pb-5 pt-4">
        {/* TODO: Replace name copy with final product title. */}
        <h3 className="text-base font-semibold tracking-tight text-zinc-900">
          {name}
        </h3>
        {highlight ? (
          <p className="text-sm text-zinc-500 line-clamp-2">{highlight}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between gap-3">
          {/* TODO: Confirm pricing before launch. */}
          <p className="text-lg font-semibold text-zinc-900">
            ${price.toFixed(2)}
          </p>
          <div className="flex gap-2">
            <AddToCartButton
              id={id}
              name={name}
              price={price}
              imageUrl={imageUrl}
              variant="minimal"
            />
            <QuickBuyButton
              id={id}
              name={name}
              price={price}
              imageUrl={imageUrl}
            />
          </div>
        </div>
      </div>
    </article>
  );
}


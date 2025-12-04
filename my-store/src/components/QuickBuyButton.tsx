"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/stores/cartStore";

type QuickBuyButtonProps = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  size?: string;
  color?: string;
};

export function QuickBuyButton(props: QuickBuyButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(() => {
          addItem({
            ...props,
            quantity: 1,
          });
          router.push("/checkout");
        })
      }
      className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-900 hover:bg-zinc-900 hover:text-white md:flex-none md:px-3 md:py-2 md:text-[10px]"
      disabled={pending}
    >
      {pending ? "..." : "Bag"}
    </button>
  );
}



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
      className="inline-flex items-center justify-center rounded-full border border-zinc-900 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-900 hover:bg-zinc-900 hover:text-white"
      disabled={pending}
    >
      {pending ? "..." : "Bag"}
    </button>
  );
}



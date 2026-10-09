"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Click anywhere outside the panel (or the launcher) closes it, Escape too.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const { listening, error: voiceError, supported, toggle, clearError } =
    useSpeechRecognition({
      onTranscript: (text) => setInput(text),
    });

  const sendMessage = async () => {
    if (!input.trim()) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user" as const, content: input }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply as string },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I ran into a connection issue. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    clearError();
    if (!supported) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
        },
      ]);
      return;
    }
    toggle();
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105 md:bottom-6 md:right-6 md:h-12 md:w-12"
        aria-label="Open AI shopping assistant"
        aria-expanded={open}
      >
        <MessageCircle size={22} className="md:w-5 md:h-5" />
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="fixed inset-x-4 bottom-4 z-50 w-auto max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl md:inset-x-auto md:bottom-6 md:right-6"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 md:text-xs">
                AI stylist
              </p>
              <p className="text-xs font-semibold text-zinc-900 md:text-sm">
                {BRAND.name} shopping assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 md:p-1"
              aria-label="Close assistant"
            >
              <X size={18} className="md:w-4 md:h-4" />
            </button>
          </div>
          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto bg-zinc-50 pl-3 pr-2 py-3 text-xs md:max-h-80 md:pl-4 md:pr-3 md:text-sm">
            {messages.length === 0 ? (
              <p className="text-[11px] text-zinc-500 md:text-xs">
                Ask about fit, shipping, styling ideas, or what goes well with
                items in your bag.
              </p>
            ) : null}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs md:max-w-[80%] md:text-sm ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "bg-white text-zinc-900 border border-zinc-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading ? (
              <p className="text-[11px] text-zinc-400 md:text-xs">Thinking…</p>
            ) : null}
          </div>
          {voiceError ? (
            <p className="border-t border-amber-100 bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-800 md:text-xs">
              {voiceError}
            </p>
          ) : null}
          <div className="flex items-center gap-2 border-t border-zinc-100 px-3 py-2.5 md:py-2">
            <button
              type="button"
              onClick={handleVoice}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border md:h-8 md:w-8 transition-colors ${
                listening
                  ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-900"
              }`}
              aria-label={listening ? "Stop listening" : "Start voice shopping"}
              title={listening ? "Click to stop listening" : "Click to speak"}
            >
              <Mic size={16} className={listening ? "animate-pulse" : ""} />
            </button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder={listening ? "Listening…" : "Ask a question..."}
              className="flex-1 border-none bg-transparent text-xs text-zinc-900 outline-none placeholder:text-zinc-400 md:text-sm"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading}
              className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-900 disabled:opacity-40 md:text-xs"
            >
              Send
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

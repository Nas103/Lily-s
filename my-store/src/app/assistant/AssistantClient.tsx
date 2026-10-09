"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mic, Send, Sparkles, Loader2 } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const PROMPTS = [
  "Style a black-tie look",
  "Find party abayas",
  "Do you ship to London?",
  "Gift ideas under R1000",
];

export function AssistantClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: `Hello! I'm ${BRAND.name}'s AI personal stylist. How can I help you today?` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, loading]);

  const { listening, error: voiceError, supported, toggle, clearError } =
    useSpeechRecognition({
      onTranscript: (text) => setInput(text),
    });

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
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
        { role: "assistant", content: (data.reply as string) ?? "..." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a connection issue. Please try again in a moment.",
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
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-10">
      <header className="mb-6">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-zinc-400">
          <Sparkles size={14} /> {BRAND.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">AI Stylist</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Your personal {BRAND.name} concierge for styling, sizing and orders.
        </p>
      </header>

      <div
        ref={scrollRef}
        className="h-[55vh] min-h-[360px] space-y-4 overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-5 pr-3"
      >
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                message.role === "user"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-100 bg-zinc-50 text-zinc-800"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Styling your answer...
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
            >
              {prompt}
            </button>
          )
        )}
      </div>

      {voiceError ? (
        <p className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          {voiceError}
        </p>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage();
        }}
        className="mt-4 flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1.5 pl-4"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={listening ? "Listening…" : "Ask about styling, sizing or orders..."}
          className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
        <button
          type="button"
          onClick={handleVoice}
          aria-label={listening ? "Stop listening" : "Voice input"}
          title={listening ? "Click to stop listening" : "Click to speak"}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
            listening
              ? "bg-red-500 text-white animate-pulse"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <Mic size={18} />
        </button>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-zinc-700 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

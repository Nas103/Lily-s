"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "@/lib/speech";

export type SpeechStatus = "idle" | "listening";

type Options = {
  /** Called with the final transcript once the user stops talking. */
  onTranscript?: (text: string) => void;
  lang?: string;
};

/**
 * Web Speech API wrapper.
 *
 * Chrome reports error:"network" when the page is not a secure context
 * (HTTPS or localhost) because it refuses to reach the speech service, so we
 * detect that up front and surface a human message instead of throwing.
 *
 * The recognition object is recreated for every session: after an error the
 * old instance stays "started" and subsequent start() calls throw
 * InvalidStateError, which looked like a dead mic button.
 */
export function useSpeechRecognition({ onTranscript, lang = "en-US" }: Options = {}) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Only consulted from event handlers, so a lazy init is enough — no effect.
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setError(
        "Voice input isn't supported in this browser. Try Chrome, Edge or Safari."
      );
      return;
    }

    if (!window.isSecureContext) {
      setError(
        "Voice input needs HTTPS or localhost. Open the site over https:// (or run npm run dev:https) — the browser blocks the speech service on plain HTTP."
      );
      return;
    }

    // A previous instance can be stuck open after an error.
    recognitionRef.current?.abort?.();

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript =
        event.results[event.resultIndex]?.[0]?.transcript?.trim() ?? "";
      setListening(false);
      recognitionRef.current = null;
      if (transcript) onTranscriptRef.current?.(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setListening(false);
      recognitionRef.current = null;

      switch (event.error) {
        case "no-speech":
          setError("Didn't hear anything. Please try again.");
          break;
        case "not-allowed":
        case "service-not-allowed":
          setError("Microphone permission denied. Allow it in your browser settings.");
          break;
        case "network":
          setError(
            "Couldn't reach the speech service. Check your connection, and make sure the page is on https:// or localhost."
          );
          break;
        case "aborted":
          break;
        default:
          setError("Speech recognition hit an error. Please try again.");
      }
    };

    recognition.onend = () => {
      setListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setError(null);
      setListening(true);
    } catch {
      recognitionRef.current = null;
      setListening(false);
      setError("Couldn't start voice input. Please try again.");
    }
  }, [lang]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, error, supported, start, stop, toggle, clearError: () => setError(null) };
}

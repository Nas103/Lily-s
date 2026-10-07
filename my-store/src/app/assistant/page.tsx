import type { Metadata } from "next";
import { AssistantClient } from "./AssistantClient";

export const metadata: Metadata = {
  title: "AI Stylist",
  description: "Chat with your personal shopping assistant for styling and sizing advice.",
};

export default function AssistantPage() {
  return <AssistantClient />;
}
import type { Metadata } from "next";
import FluxLines from "@/components/FluxLines";
import { AssistantClient } from "./AssistantClient";

export const metadata: Metadata = {
  title: "AI Stylist",
  description: "Chat with your personal shopping assistant for styling and sizing advice.",
};

export default function AssistantPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 z-0 bg-black">
        <FluxLines
          colors={["#4a2e0a", "#f5b301", "#fff7e6"]}
          glow={2}
          rimWidth={0.2}
          lineWidth={1}
          flowDirection="down"
          mouseInteraction
          clickSwirl
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          sharpness={2.5}
          shimmer={1.5}
          mouseStrength={1}
          mouseRadius={0.35}
          intro
          lightMode={false}
        />
      </div>
      <div className="relative z-10">
        <AssistantClient />
      </div>
    </div>
  );
}

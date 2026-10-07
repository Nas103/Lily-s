import type { Metadata } from "next";
import { PreferencesClient } from "./PreferencesClient";

export const metadata: Metadata = {
  title: "Preferences",
  description: "Personalise your shop, alerts, privacy and linked accounts.",
};

export default function PreferencesPage() {
  return <PreferencesClient />;
}
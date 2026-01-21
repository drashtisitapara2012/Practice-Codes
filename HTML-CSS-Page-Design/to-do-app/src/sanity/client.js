import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "2tlur1cc",
  dataset: "production",
  apiVersion: "2025-01-20",
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN, // For Vite
  ignoreBrowserTokenWarning: true,
});
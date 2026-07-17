import { NextResponse } from "next/server"

export async function GET() {
  const manifest = {
    name: "Nexora",
    short_name: "Nexora",
    description: "AI, Gaming, Esports & Tech News",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#dc2626",
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }
  return NextResponse.json(manifest)
}

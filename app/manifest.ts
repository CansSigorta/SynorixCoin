import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Synorix Wallet",
    short_name: "Synorix",
    description: "Synorix (SNRX) — non-custodial wallet, mining, and market.",
    start_url: "/wallet",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050810",
    theme_color: "#050810",
    icons: [
      { src: "/logo.png", sizes: "192x192 512x512", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "192x192 512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

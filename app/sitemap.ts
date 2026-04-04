import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const paths = [
  "",
  "/about",
  "/features",
  "/whitepaper",
  "/roadmap",
  "/tokenomics",
  "/community",
<<<<<<< HEAD
=======
  "/testnet",
>>>>>>> 5fc9d50 (Initial commit)
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.85,
  }));
}

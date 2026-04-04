export const SITE = {
  name: "Synorix",
  ticker: "SNRX",
  tagline: "Faster and more usable evolution of Bitcoin",
  url: "https://synorixcoin.com",
  description:
    "Synorix (SNRX) is a SHA-256 proof-of-work cryptocurrency with 2.5-minute blocks, near-zero fees, optional privacy, and a 21 million fixed supply—inspired by Bitcoin’s sound design.",
  /** File in /public — official raster logo (PNG/WebP) */
  logoPath: "/logo.png",
  logoAlt: "Synorix Coin logo",
  /** Increase when you replace the image so CDN/browsers fetch the new file */
  logoVersion: "1",
} as const;

<<<<<<< HEAD
=======
/** Public Synorix Core Git URL when published (e.g. https://github.com/org/synorix-core) */
export const SYNORIX_CORE_REPO_URL: string | null = null;

>>>>>>> 5fc9d50 (Initial commit)
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/tokenomics", label: "Tokenomics" },
  { href: "/community", label: "Community" },
<<<<<<< HEAD
=======
  { href: "/testnet", label: "Testnet" },
>>>>>>> 5fc9d50 (Initial commit)
] as const;

export const SITE = {
  name: "Synorix",
  ticker: "SNRX",
  tagline: "Own, mine, and use an independent SHA-256 blockchain",
  url: "https://synorixcoin.com",
  description:
    "Synorix (SNRX) is an independent SHA-256 proof-of-work blockchain with a non-custodial web wallet, fair open mining, a live in-site market, and a 21 million fixed supply. Your keys, your coins.",
  /** File in /public — official raster logo (PNG/WebP) */
  logoPath: "/logo.png",
  logoAlt: "Synorix Coin logo",
  /** Increase when you replace the image so CDN/browsers fetch the new file */
  logoVersion: "1",
} as const;

/** Public Synorix Core repository. */
export const SYNORIX_CORE_REPO_URL = "https://github.com/Synorixz/synorix";

/** Tight, action-first top navigation. */
export const NAV_LINKS = [
  { href: "/wallet", label: "Wallet" },
  { href: "/swap", label: "Buy SNRX" },
  { href: "/mining", label: "Mine" },
  { href: "/tokenomics", label: "Tokenomics" },
  { href: "/about", label: "About" },
] as const;

/** Fuller, grouped links for the footer. */
export const FOOTER_GROUPS = [
  {
    heading: "Use",
    links: [
      { href: "/wallet", label: "Wallet" },
      { href: "/swap", label: "Buy & Sell" },
      { href: "/mining", label: "Mine" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/about", label: "About" },
      { href: "/features", label: "Features" },
      { href: "/tokenomics", label: "Tokenomics" },
      { href: "/whitepaper", label: "Whitepaper" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
  {
    heading: "Network",
    links: [
      { href: "/testnet", label: "Testnet" },
      { href: "/community", label: "Community" },
      { href: SYNORIX_CORE_REPO_URL, label: "GitHub", external: true },
    ],
  },
] as const;

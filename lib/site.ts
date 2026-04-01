export const SITE = {
  name: "Synorix",
  ticker: "SNRX",
  tagline: "Faster and more usable evolution of Bitcoin",
  url: "https://synorixcoin.com",
  description:
    "Synorix (SNRX) is a SHA-256 proof-of-work cryptocurrency with 2.5-minute blocks, near-zero fees, optional privacy, and a 21 million fixed supply—inspired by Bitcoin’s sound design.",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/tokenomics", label: "Tokenomics" },
  { href: "/community", label: "Community" },
] as const;

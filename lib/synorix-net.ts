// Synorix network parameters for @scure/btc-signer (from src/kernel/chainparams.cpp).
// Browser-native crypto stack (@scure/@noble) — no Buffer polyfills needed in Next.js.

export type SnrxNet = {
  bech32: string;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
  bip32: { public: number; private: number };
  coinType: number;
  label: string;
};

export const SYNORIX_NETWORKS: Record<"mainnet" | "testnet", SnrxNet> = {
  mainnet: {
    bech32: "snrx",
    pubKeyHash: 63,
    scriptHash: 122,
    wif: 191,
    bip32: { public: 0x0488b21e, private: 0x0488ade4 },
    coinType: 0,
    label: "Mainnet",
  },
  testnet: {
    bech32: "tsnrx",
    pubKeyHash: 65,
    scriptHash: 124,
    wif: 239,
    bip32: { public: 0x043587cf, private: 0x04358394 },
    coinType: 1,
    label: "Testnet",
  },
};

// Active network for the web wallet (testnet until mainnet launch).
export const ACTIVE_NETWORK: "mainnet" | "testnet" =
  (process.env.NEXT_PUBLIC_SNRX_NETWORK as "mainnet" | "testnet") || "testnet";

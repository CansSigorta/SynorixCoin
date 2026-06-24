// MetaMask / BSC integration for buying SNRX with USDT (BEP-20).
// Uses the raw EIP-1193 provider (window.ethereum) — no web3 library needed.

export type BscNetwork = {
  key: "mainnet" | "testnet";
  chainIdHex: string;       // e.g. "0x38"
  chainIdNum: number;
  name: string;
  rpcUrl: string;
  explorer: string;
  usdt: string;             // BEP-20 USDT contract
  usdtDecimals: number;
};

export const BSC_NETWORKS: Record<"mainnet" | "testnet", BscNetwork> = {
  mainnet: {
    key: "mainnet",
    chainIdHex: "0x38",
    chainIdNum: 56,
    name: "BNB Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com",
    usdt: "0x55d398326f99059fF775485246999027B3197955", // BSC-USD (USDT), 18 decimals
    usdtDecimals: 18,
  },
  testnet: {
    key: "testnet",
    chainIdHex: "0x61",
    chainIdNum: 97,
    name: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorer: "https://testnet.bscscan.com",
    // Configurable test USDT contract (18 decimals assumed); override via env.
    usdt: process.env.NEXT_PUBLIC_BSC_TEST_USDT || "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    usdtDecimals: 18,
  },
};

export const ACTIVE_BSC: BscNetwork =
  BSC_NETWORKS[(process.env.NEXT_PUBLIC_BSC_NETWORK as "mainnet" | "testnet") || "mainnet"];

/** Address that collects buyers' USDT (the liquidity wallet). */
export const BSC_RECEIVER: string =
  process.env.NEXT_PUBLIC_BSC_RECEIVER || "0xCF9f877f80a488B38609234575d8b251c7b76c8e";

/** Buying is open. Selling back is not available yet — surfaced honestly to
 *  buyers in the UI so the early-stage risk is clear. */
export const BUY_PAUSED = false;
export const SELL_OPEN = false;

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export function getEthereum(): Eip1193 | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: Eip1193 }).ethereum ?? null;
}

export function hasMetaMask(): boolean {
  return getEthereum() !== null;
}

/** Pad a hex string (no 0x) to 32 bytes (64 hex chars), left-padded. */
function padHex(hex: string): string {
  return hex.replace(/^0x/, "").toLowerCase().padStart(64, "0");
}

/** Convert a decimal USDT amount to its on-chain integer (as hex, no 0x). */
export function usdtToUnits(amount: number, decimals: number): string {
  // Avoid float drift: work in string with fixed decimals.
  const [whole, frac = ""] = amount.toString().split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const units = BigInt(whole + fracPadded);
  return units.toString(16);
}

/** Encode ERC-20 transfer(address,uint256) calldata. */
export function encodeTransfer(to: string, amountUnitsHex: string): string {
  const selector = "a9059cbb"; // keccak256("transfer(address,uint256)")[:4]
  return "0x" + selector + padHex(to) + padHex(amountUnitsHex);
}

export async function connectMetaMask(): Promise<string> {
  const eth = getEthereum();
  if (!eth) throw new Error("MetaMask not found. Install it to continue.");
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  if (!accounts?.length) throw new Error("No account selected.");
  return accounts[0];
}

export async function ensureBscChain(net: BscNetwork): Promise<void> {
  const eth = getEthereum();
  if (!eth) throw new Error("MetaMask not found.");
  const current = (await eth.request({ method: "eth_chainId" })) as string;
  if (current?.toLowerCase() === net.chainIdHex.toLowerCase()) return;
  try {
    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: net.chainIdHex }] });
  } catch (e: unknown) {
    // 4902 = chain not added to MetaMask; add it.
    if ((e as { code?: number })?.code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: net.chainIdHex,
          chainName: net.name,
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: [net.rpcUrl],
          blockExplorerUrls: [net.explorer],
        }],
      });
    } else {
      throw e;
    }
  }
}

/** Send a USDT payment to the receiver. Returns the tx hash. */
export async function payUsdt(from: string, amount: number, net: BscNetwork, receiver: string): Promise<string> {
  const eth = getEthereum();
  if (!eth) throw new Error("MetaMask not found.");
  if (!receiver) throw new Error("Receiver address not configured.");
  const data = encodeTransfer(receiver, usdtToUnits(amount, net.usdtDecimals));
  const txHash = (await eth.request({
    method: "eth_sendTransaction",
    params: [{ from, to: net.usdt, data, value: "0x0" }],
  })) as string;
  return txHash;
}

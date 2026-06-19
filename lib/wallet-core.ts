// Synorix non-custodial web wallet core (runs in the browser).
// Keys are generated and kept on the user's device (localStorage, AES-GCM
// encrypted). The node is reached only through /api/node (scantxoutset for
// balances, sendrawtransaction to broadcast). Crypto: audited @scure/@noble.
// The signing path uses exactly the APIs verified end-to-end on regtest.

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { HDKey } from "@scure/bip32";
import * as btc from "@scure/btc-signer";
import { SYNORIX_NETWORKS, ACTIVE_NETWORK, type SnrxNet } from "@/lib/synorix-net";

const GAP_LIMIT = 25;
const COINBASE_MATURITY = 100;
const SATS = 100_000_000;
const DUST = 294n;

export type EncBlob = { salt: string; iv: string; data: string };
export type WalletMeta = { id: string; name: string; network: "mainnet" | "testnet"; enc: EncBlob; xpub: string };

function net(meta: WalletMeta): SnrxNet { return SYNORIX_NETWORKS[meta.network]; }
function versionsOf(n: SnrxNet) { return { private: n.bip32.private, public: n.bip32.public }; }
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const ub64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const hexToBytes = (h: string) => Uint8Array.from(h.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
const bytesToHex = (u: Uint8Array) => Array.from(u, (b) => b.toString(16).padStart(2, "0")).join("");
function randId() { return "w_" + bytesToHex(crypto.getRandomValues(new Uint8Array(6))); }

/* ---------- encryption (WebCrypto AES-256-GCM, PBKDF2) ---------- */
async function deriveKey(password: string, salt: Uint8Array, usage: KeyUsage[]) {
  const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 200_000, hash: "SHA-256" },
    km, { name: "AES-GCM", length: 256 }, false, usage,
  );
}
async function encrypt(plaintext: string, password: string): Promise<EncBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext)));
  return { salt: b64(salt), iv: b64(iv), data: b64(ct) };
}
async function decrypt(blob: EncBlob, password: string): Promise<string> {
  const key = await deriveKey(password, ub64(blob.salt), ["decrypt"]);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ub64(blob.iv) }, key, ub64(blob.data));
  return new TextDecoder().decode(pt);
}

/* ---------- derivation ---------- */
function accountPath(n: SnrxNet) { return `m/84'/${n.coinType}'/0'`; }
function rootFromMnemonic(mnemonic: string, n: SnrxNet) {
  return HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic.trim()), versionsOf(n));
}
function accountXpub(mnemonic: string, n: SnrxNet) {
  return rootFromMnemonic(mnemonic, n).derive(accountPath(n)).publicExtendedKey;
}
function addrFromXpub(meta: WalletMeta, chain: number, i: number): string {
  const n = net(meta);
  const node = HDKey.fromExtendedKey(meta.xpub, versionsOf(n)).deriveChild(chain).deriveChild(i);
  return btc.p2wpkh(node.publicKey!, n).address!;
}
// derive the wallet's address set: address + its scriptPubKey hex + path location
type Slot = { address: string; scriptHex: string; chain: number; index: number };
function deriveSet(meta: WalletMeta): Slot[] {
  const n = net(meta);
  const acc = HDKey.fromExtendedKey(meta.xpub, versionsOf(n));
  const out: Slot[] = [];
  for (const chain of [0, 1]) {
    const branch = acc.deriveChild(chain);
    for (let i = 0; i < GAP_LIMIT; i++) {
      const p = btc.p2wpkh(branch.deriveChild(i).publicKey!, n);
      out.push({ address: p.address!, scriptHex: bytesToHex(p.script), chain, index: i });
    }
  }
  return out;
}

/* ---------- node RPC via the same-origin proxy ---------- */
type Utxo = { txid: string; vout: number; scriptPubKey: string; amount: number; height?: number; coinbase?: boolean };
async function rpc<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch("/api/node", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ method, params }) });
  const j = (await res.json()) as { result?: T; error?: string };
  if (j.error) throw new Error(j.error);
  return j.result as T;
}
async function scanUtxos(addresses: string[]): Promise<Utxo[]> {
  const r = await rpc<{ unspents?: Utxo[] }>("scantxoutset", ["start", addresses.map((a) => `addr(${a})`)]);
  return r.unspents || [];
}

/* ---------- public API ---------- */
export async function createWallet(name: string, password: string): Promise<{ meta: WalletMeta; mnemonic: string }> {
  const n = SYNORIX_NETWORKS[ACTIVE_NETWORK];
  const mnemonic = generateMnemonic(wordlist, 128);
  const meta: WalletMeta = { id: randId(), name: name || "Wallet", network: ACTIVE_NETWORK, enc: await encrypt(mnemonic, password), xpub: accountXpub(mnemonic, n) };
  return { meta, mnemonic };
}
export async function restoreWallet(name: string, mnemonic: string, password: string): Promise<{ meta: WalletMeta }> {
  const m = mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
  if (!validateMnemonic(m, wordlist)) throw new Error("Invalid recovery phrase.");
  const n = SYNORIX_NETWORKS[ACTIVE_NETWORK];
  const meta: WalletMeta = { id: randId(), name: name || "Wallet", network: ACTIVE_NETWORK, enc: await encrypt(m, password), xpub: accountXpub(m, n) };
  return { meta };
}
export async function checkPassword(meta: WalletMeta, password: string): Promise<boolean> {
  try { await decrypt(meta.enc, password); return true; } catch { return false; }
}
export async function revealMnemonic(meta: WalletMeta, password: string): Promise<string> {
  return decrypt(meta.enc, password);
}
export function firstReceiveAddress(meta: WalletMeta): string { return addrFromXpub(meta, 0, 0); }

export async function getBalance(meta: WalletMeta): Promise<{ spendable: number; immature: number; total: number }> {
  const slots = deriveSet(meta);
  const unspents = await scanUtxos(slots.map((s) => s.address));
  const tip = Number(await rpc<number>("getblockcount"));
  let sp = 0, im = 0;
  for (const u of unspents) {
    const confs = u.height ? tip - u.height + 1 : 0;
    if (u.coinbase && confs < COINBASE_MATURITY) im += Math.round(u.amount * SATS); else sp += Math.round(u.amount * SATS);
  }
  return { spendable: sp / SATS, immature: im / SATS, total: (sp + im) / SATS };
}

export async function send(meta: WalletMeta, password: string, to: string, amountSnrx: number): Promise<{ txid: string; fee: number }> {
  const n = net(meta);
  const mnemonic = await decrypt(meta.enc, password); // throws on wrong password
  const root = rootFromMnemonic(mnemonic, n);
  const slots = deriveSet(meta);
  const byScript = new Map(slots.map((s) => [s.scriptHex, s]));
  const tip = Number(await rpc<number>("getblockcount"));
  const unspents = await scanUtxos(slots.map((s) => s.address));
  const spendables = unspents
    .filter((u) => byScript.has(u.scriptPubKey))
    .filter((u) => !(u.coinbase && tip - (u.height || tip) + 1 < COINBASE_MATURITY))
    .sort((a, b) => b.amount - a.amount);

  const target = BigInt(Math.round(amountSnrx * SATS));
  if (target <= 0n) throw new Error("Amount must be greater than 0.");
  const selected: Utxo[] = []; let inSats = 0n, fee = 0n;
  for (const u of spendables) {
    selected.push(u); inSats += BigInt(Math.round(u.amount * SATS));
    fee = BigInt(11 + selected.length * 68 + 2 * 31); // ~1 sat/vbyte
    if (inSats >= target + fee) break;
  }
  if (inSats < target + fee) throw new Error("Insufficient spendable funds. Mining rewards mature after 100 blocks.");

  const tx = new btc.Transaction();
  for (const u of selected) {
    tx.addInput({ txid: u.txid, index: u.vout, witnessUtxo: { script: hexToBytes(u.scriptPubKey), amount: BigInt(Math.round(u.amount * SATS)) } });
  }
  // validate destination by adding the output (throws on a wrong-network/invalid address)
  try { tx.addOutputAddress(to, target, n); } catch { throw new Error("Invalid Synorix address."); }
  const change = inSats - target - fee;
  if (change >= DUST) tx.addOutputAddress(addrFromXpub(meta, 1, 0), change, n);

  // sign with each owning key (tx.sign signs every input that key controls)
  const signedKeys = new Set<string>();
  for (const u of selected) {
    const slot = byScript.get(u.scriptPubKey)!;
    const child = root.derive(`${accountPath(n)}/${slot.chain}/${slot.index}`);
    const kh = bytesToHex(child.privateKey!);
    if (!signedKeys.has(kh)) { tx.sign(child.privateKey!); signedKeys.add(kh); }
  }
  tx.finalize();
  const txid = await rpc<string>("sendrawtransaction", [tx.hex]);
  return { txid, fee: Number(fee) / SATS };
}

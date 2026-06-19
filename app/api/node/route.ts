import { NextRequest, NextResponse } from "next/server";

// Server-side proxy to the Synorix node JSON-RPC. The browser wallet/explorer
// call this same-origin (HTTPS) so there is no mixed-content; RPC credentials
// stay on the server and never reach the client. Only safe read/broadcast
// methods are allowed — never wallet/key methods (the node holds no keys).

export const runtime = "nodejs";

const RPC_URL = process.env.SNRX_RPC_URL || "http://161.97.180.76:9332";
const RPC_USER = process.env.SNRX_RPC_USER || "synorix";
const RPC_PASS = process.env.SNRX_RPC_PASS || "Can700890";

const ALLOWED = new Set([
  "scantxoutset",
  "sendrawtransaction",
  "getblockcount",
  "getblockchaininfo",
  "getrawtransaction",
  "getblockhash",
  "getblock",
  "getblockheader",
  "estimatesmartfee",
]);

async function rpc(method: string, params: unknown[]): Promise<unknown> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${RPC_USER}:${RPC_PASS}`).toString("base64"),
    },
    body: JSON.stringify({ jsonrpc: "1.0", id: "web", method, params }),
  });
  const j = (await res.json()) as { result?: unknown; error?: { message: string } };
  if (j.error) throw new Error(j.error.message);
  return j.result;
}

// scantxoutset can only run one at a time on the node; serialize within this
// instance and retry briefly if another scan is mid-flight.
let scanQueue: Promise<unknown> = Promise.resolve();
async function scan(params: unknown[]): Promise<unknown> {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const p = scanQueue.catch(() => {}).then(() => rpc("scantxoutset", params));
      scanQueue = p.catch(() => {});
      return await p;
    } catch (e) {
      if (String((e as Error).message).includes("already in progress") && attempt < 5) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      throw e;
    }
  }
  throw new Error("scan busy");
}

export async function POST(req: NextRequest) {
  try {
    const { method, params } = (await req.json()) as { method: string; params?: unknown[] };
    if (!ALLOWED.has(method)) {
      return NextResponse.json({ error: "method not allowed" }, { status: 400 });
    }
    const result =
      method === "scantxoutset" ? await scan(params || []) : await rpc(method, params || []);
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

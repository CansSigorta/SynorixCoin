import { NextRequest, NextResponse } from "next/server";

// Server-side proxy for the browser wallet. It forwards allow-listed read/
// broadcast calls to the node's wallet-RPC endpoint on the VPS (the explorer
// service), which talks to the node over localhost. The node's RPC is bound to
// localhost and its password never leaves the VPS — nothing secret lives here.

export const runtime = "nodejs";

// VPS wallet-RPC endpoint (explorer /api/rpc). Override with SNRX_NODE_API.
const NODE_API = process.env.SNRX_NODE_API || "http://161.97.180.76:3001/api/rpc";

const ALLOWED = new Set([
  "scantxoutset", "sendrawtransaction", "getblockcount", "getblockchaininfo",
  "getrawtransaction", "getblockhash", "getblock", "getblockheader", "estimatesmartfee",
]);

export async function POST(req: NextRequest) {
  try {
    const { method, params } = (await req.json()) as { method: string; params?: unknown[] };
    if (!ALLOWED.has(method)) {
      return NextResponse.json({ error: "method not allowed" }, { status: 400 });
    }
    const res = await fetch(NODE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, params: params || [] }),
    });
    const j = (await res.json()) as { result?: unknown; error?: string };
    if (j.error) return NextResponse.json({ error: j.error }, { status: 500 });
    return NextResponse.json({ result: j.result });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

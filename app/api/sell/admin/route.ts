import { NextRequest, NextResponse } from "next/server";

// Owner-only: list pending sell requests and mark one paid (after sending the
// USDT by hand). The admin token is verified on the VPS; it just passes through.
export const runtime = "nodejs";

const BASE = process.env.SNRX_AMM_API || "http://161.97.180.76:3001/api/amm";

export async function POST(req: NextRequest) {
  try {
    const { action, token, txid } = await req.json();
    if (action === "list") {
      const r = await fetch(`${BASE}/sell-list?token=${encodeURIComponent(token || "")}`, { cache: "no-store" });
      return NextResponse.json(await r.json(), { status: r.status });
    }
    if (action === "paid") {
      const r = await fetch(`${BASE}/sell-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, txid }),
      });
      return NextResponse.json(await r.json(), { status: r.status });
    }
    return NextResponse.json({ error: "bad action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

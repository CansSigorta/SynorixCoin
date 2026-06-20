import { NextRequest, NextResponse } from "next/server";

// Manual sell: seller registers a payout request after sending SNRX to the
// reserve. POST creates the request; GET polls its status. Payout is done by
// the owner by hand (see /api/sell/admin).
export const runtime = "nodejs";

const BASE = process.env.SNRX_AMM_API || "http://161.97.180.76:3001/api/amm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BASE}/sell-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const txid = req.nextUrl.searchParams.get("txid");
  try {
    const r = await fetch(`${BASE}/sell-status?txid=${encodeURIComponent(txid || "")}`, { cache: "no-store" });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

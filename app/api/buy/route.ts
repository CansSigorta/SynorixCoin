import { NextRequest, NextResponse } from "next/server";

// Proxy for the MetaMask/BSC buy flow. POST submits a USDT payment tx hash for
// verification + SNRX delivery; GET polls delivery status. The VPS service does
// the on-chain verification and reserve payout — no keys ever touch the site.
export const runtime = "nodejs";

const BASE = process.env.SNRX_AMM_API || "http://161.97.180.76:3001/api/amm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BASE}/bsc-buy`, {
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
  const txHash = req.nextUrl.searchParams.get("txHash");
  if (!txHash) return NextResponse.json({ error: "txHash required" }, { status: 400 });
  try {
    const r = await fetch(`${BASE}/bsc-buy-status?txHash=${encodeURIComponent(txHash)}`, { cache: "no-store" });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

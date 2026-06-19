import { NextRequest, NextResponse } from "next/server";

// Proxy to the VPS AMM pricing service (constant-product x*y=k). GET -> live
// price + reserves; POST {side, amount} -> a swap quote (amount out + price impact).
export const runtime = "nodejs";

const AMM = process.env.SNRX_AMM_API || "http://161.97.180.76:3001/api/amm";

export async function GET() {
  try {
    const r = await fetch(`${AMM}/price`, { cache: "no-store" });
    return NextResponse.json(await r.json());
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${AMM}/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await r.json());
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

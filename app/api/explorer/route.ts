import { NextRequest, NextResponse } from "next/server";

// Read-only proxy to the VPS block explorer (network info, recent blocks, and
// block / tx / address lookups). All data is public chain data.
export const runtime = "nodejs";

const BASE = process.env.SNRX_EXPLORER_API || "http://161.97.180.76:3001/api";

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") || "info";
  const id = req.nextUrl.searchParams.get("id") || "";
  let path: string | null = null;
  if (action === "info") path = "/info";
  else if (action === "blocks") path = "/blocks";
  else if (action === "block") path = `/block/${encodeURIComponent(id)}`;
  else if (action === "tx") path = `/tx/${encodeURIComponent(id)}`;
  else if (action === "address") path = `/address/${encodeURIComponent(id)}`;
  if (!path) return NextResponse.json({ error: "bad action" }, { status: 400 });
  try {
    const r = await fetch(`${BASE}${path}`, { cache: "no-store" });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 });
  }
}

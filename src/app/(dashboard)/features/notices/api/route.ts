import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ feature: "notices", status: "placeholder" });
}

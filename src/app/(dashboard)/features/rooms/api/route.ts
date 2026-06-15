import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ feature: "rooms", status: "placeholder" });
}

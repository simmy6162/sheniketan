import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ feature: "complaints", status: "placeholder" });
}

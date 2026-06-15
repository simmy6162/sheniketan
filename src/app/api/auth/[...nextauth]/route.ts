import { NextResponse } from "next/server";

/** NextAuth route handler placeholder — configured on Day 1+ */
export async function GET() {
  return NextResponse.json(
    { message: "Authentication not configured yet" },
    { status: 501 },
  );
}

export async function POST() {
  return NextResponse.json(
    { message: "Authentication not configured yet" },
    { status: 501 },
  );
}

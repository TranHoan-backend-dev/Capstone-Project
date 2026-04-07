import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";

export async function GET(req: NextRequest) {
  const token = getAccessToken(req);
  return NextResponse.json({ token });
}

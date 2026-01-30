import { getProfileEmployee } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("__Secure-access_token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Không tìm thấy access token" },
        { status: 401 },
      );
    }

    const profile = await getProfileEmployee(accessToken);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { message: "Không thể lấy thông tin người dùng" },
      { status: 500 },
    );
  }
}

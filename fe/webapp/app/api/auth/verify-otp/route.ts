import { verifyOtpService } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otpString } = await req.json();

    if (!otpString || !email) {
      return NextResponse.json(
        { message: "Vui lòng nhập đủ thông tin" },
        { status: 400 },
      );
    }

    const isValid = await verifyOtpService(email, otpString);

    if (!isValid) {
      return NextResponse.json(
        { message: "OTP không hợp lệ hoặc đã hết hạn" },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "OTP hợp lệ" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

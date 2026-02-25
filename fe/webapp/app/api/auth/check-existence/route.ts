import { checkExistenceService, sendOtpService } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Vui lòng nhập email" },
        { status: 400 },
      );
    }

    const exists = await checkExistenceService(email);

    if (!exists) {
      return NextResponse.json(
        {
          message: "Email không tồn tại trong hệ thống",
          data: false,
        },
        { status: 200 },
      );
    }

    let otpRes;
    try {
      otpRes = await sendOtpService(email);
    } catch (err: any) {
      return NextResponse.json(
        { message: "Không thể gửi OTP" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: otpRes.message,
        data: exists,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

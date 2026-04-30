import { changePasswordService } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { oldPassword, newPassword, confirmPassword } = await req.json();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 },
      );
    }
    const accessToken =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("__Secure-access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Unauthorized: missing access token" },
        { status: 401 },
      );
    }

    await changePasswordService(
      accessToken,
      oldPassword,
      newPassword,
      confirmPassword,
    );

    // Xóa tất cả token trong cookie sau khi đổi mật khẩu thành công
    const res = NextResponse.json(
      { message: "Đổi mật khẩu thành công" },
      { status: 200 },
    );

    const isProduction = process.env.NODE_ENV === "production";
    const domain = isProduction ? process.env.NEXT_PUBLIC_DOMAIN : undefined;

    const cookieOptions = {
      maxAge: 0,
      path: "/",
      domain: domain,
      secure: isProduction,
      sameSite: "lax" as const,
      httpOnly: true,
    };

    res.cookies.set("access_token", "", cookieOptions);
    res.cookies.set("refresh_token", "", cookieOptions);

    if (isProduction) {
      res.cookies.set("__Secure-access_token", "", {
        ...cookieOptions,
        secure: true,
      });
      res.cookies.set("__Secure-refresh_token", "", {
        ...cookieOptions,
        secure: true,
      });
    }

    return res;
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message },
        { status: error.response.status },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

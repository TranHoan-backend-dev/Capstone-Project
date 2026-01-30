import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { keycloakLogin } from "@/services/keycloak.service";
import { signinService } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const ACCESS_TOKEN_FALLBACK = 300; // 5 phút
  const ACCESS_TOKEN_MAX_AGE = 900; // 15 phút
  const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Thiếu tên đăng nhập hoặc mật khẩu" },
        { status: 400 },
      );
    }

    const tokenRes = await keycloakLogin({ username, password });

    if (!tokenRes?.access_token) {
      throw new Error("NO_TOKEN");
    }

    let backendData;
    try {
      const backendRes = await signinService(tokenRes.access_token);
      backendData = backendRes.data?.data;
    } catch (backendError: any) {
      if (axios.isAxiosError(backendError)) {
        const status = backendError.response?.status;
        const message = backendError.response?.data?.message;

        if (status === 403) {
          return NextResponse.json(
            { message: message || "Tài khoản đã bị khóa hoặc vô hiệu hóa" },
            { status: 403 },
          );
        }

        if (status === 400) {
          return NextResponse.json(
            { message: message || "Thông tin tài khoản không hợp lệ" },
            { status: 400 },
          );
        }
      }

      throw new Error("Backend verification failed");
    }

    const res = NextResponse.json(
      {
        message: "Đăng nhập thành công",
        data: backendData,
      },
      { status: 200 },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
      path: "/",
    };

    res.cookies.set(
      isProduction ? "__Secure-access_token" : "access_token",
      tokenRes.access_token,
      {
        ...cookieOptions,
        maxAge: Math.min(
          tokenRes.expires_in || ACCESS_TOKEN_FALLBACK,
          ACCESS_TOKEN_MAX_AGE,
        ),
      },
    );

    res.cookies.set(
      isProduction ? "__Secure-refresh_token" : "refresh_token",
      tokenRes.refresh_token,
      {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      },
    );

    return res;
  } catch (error: any) {
    let message = "Đăng nhập thất bại";
    let status = 401;

    if (axios.isAxiosError(error)) {
      const kcError = error.response?.data?.error;

      if (kcError === "invalid_grant") {
        message = "Sai tên đăng nhập hoặc mật khẩu";
      } else if (error.response?.status === 401) {
        message = "Sai tên đăng nhập hoặc mật khẩu";
      } else {
        message = "Không thể kết nối hệ thống xác thực";
        status = 500;
      }
    }

    return NextResponse.json({ message }, { status });
  }
}

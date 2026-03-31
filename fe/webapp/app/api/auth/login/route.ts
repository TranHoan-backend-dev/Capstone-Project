import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { signinService } from "@/services/auth.service";
import { IS_PRODUCTION } from "@/constants/auth.constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Thiếu tên đăng nhập hoặc mật khẩu" },
        { status: 400 },
      );
    }

    let backendData;
    try {
      const backendRes = await signinService(username, password);

      backendData = backendRes.data;
      if (!backendData) {
        throw new Error("No data from backend");
      }
    } catch (backendError: any) {
      if (axios.isAxiosError(backendError)) {
        const status = backendError.response?.status;
        const message = backendError.response?.data?.message;

        if (status === 403) {
          return NextResponse.json(
            { message: "Tài khoản đã bị khóa hoặc vô hiệu hóa" },
            { status: 403 },
          );
        }

        if (status === 400) {
          return NextResponse.json(
            { message: "Thông tin tài khoản không hợp lệ" },
            { status: 400 },
          );
        }

        if (status === 401) {
          return NextResponse.json(
            { message: "Sai tên đăng nhập hoặc mật khẩu" },
            { status: 401 },
          );
        }
      }

      throw backendError;
    }
    const tokenResponse = backendData.data?.token;
    const res = NextResponse.json(backendData.data);

    const cookieOptions = {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: (IS_PRODUCTION ? "none" : "lax") as "none" | "lax",
      path: "/",
    };

    if (tokenResponse?.access_token) {
      res.cookies.set(
        IS_PRODUCTION ? "__Secure-access_token" : "access_token",
        tokenResponse.access_token,
        {
          ...cookieOptions,
          maxAge: tokenResponse.expires_in || 300,
        },
      );
    }

    if (tokenResponse?.refresh_token) {
      res.cookies.set(
        IS_PRODUCTION ? "__Secure-refresh_token" : "refresh_token",
        tokenResponse.refresh_token,
        {
          ...cookieOptions,
        },
      );
    }

    return res;
  } catch (error: any) {
    let message = "Đăng nhập thất bại";
    let status = 401;

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        message = "Sai tên đăng nhập hoặc mật khẩu";
      } else if (error.response?.status === 500) {
        message = "Lỗi hệ thống, vui lòng thử lại sau";
        status = 500;
      } else {
        message =
          error.response?.data?.message ||
          "Không thể kết nối hệ thống xác thực";
        status = error.response?.status || 500;
      }
    }

    return NextResponse.json({ message }, { status });
  }
}

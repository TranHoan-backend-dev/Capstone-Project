import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { signinService } from "@/services/auth.service";
import {
  IS_PRODUCTION,
  MAX_AGE_REFRESH_TOKEN,
} from "@/constants/auth.constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, deviceId, deviceInfo } = body;

    console.log("Login request body:", { username, deviceId, deviceInfo });

    if (!username || !password) {
      return NextResponse.json(
        { message: "Thiếu tên đăng nhập hoặc mật khẩu" },
        { status: 400 },
      );
    }

    let backendData;
    try {
      const backendRes = await signinService(
        username,
        password,
        deviceId,
        deviceInfo,
      );
      backendData = backendRes.data;
      if (!backendData) {
        throw new Error("No data from backend");
      }
    } catch (backendError: any) {
      console.error("Backend error details:", {
        status: backendError.response?.status,
        data: backendError.response?.data,
        message: backendError.message,
      });

      if (axios.isAxiosError(backendError)) {
        const status = backendError.response?.status;
        const responseData = backendError.response?.data;

        console.log("Backend response:", responseData);

        if (status === 403) {
          return NextResponse.json(
            {
              message:
                responseData?.message ||
                "Tài khoản đã bị khóa hoặc vô hiệu hóa",
            },
            { status: 403 },
          );
        }

        if (status === 400) {
          return NextResponse.json(
            {
              message:
                responseData?.message || "Thông tin tài khoản không hợp lệ",
            },
            { status: 400 },
          );
        }

        if (status === 401) {
          // Trả về message chi tiết từ backend
          return NextResponse.json(
            {
              message:
                responseData?.message || "Sai tên đăng nhập hoặc mật khẩu",
              needVerification: responseData?.needVerification || false,
              sessionId: responseData?.sessionId || null,
            },
            { status: 401 },
          );
        }
      }

      throw backendError;
    }

    const tokenResponse = backendData.data?.token;
    const accessToken =
      tokenResponse?.access_token || tokenResponse?.accessToken;
    const refreshToken =
      tokenResponse?.refresh_token || tokenResponse?.refreshToken;
    const accessTokenMaxAge =
      Number(tokenResponse?.expires_in ?? tokenResponse?.expiredTime) || 300;
    const res = NextResponse.json(backendData.data);

    const cookieOptions = {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: (IS_PRODUCTION ? "none" : "lax") as "none" | "lax",
      path: "/",
    };

    if (accessToken) {
      res.cookies.set(
        IS_PRODUCTION ? "__Secure-access_token" : "access_token",
        accessToken,
        {
          ...cookieOptions,
          maxAge: accessTokenMaxAge,
        },
      );
    }

    if (refreshToken) {
      res.cookies.set(
        IS_PRODUCTION ? "__Secure-refresh_token" : "refresh_token",
        refreshToken,
        {
          ...cookieOptions,
          maxAge: MAX_AGE_REFRESH_TOKEN,
        },
      );
    }

    return res;
  } catch (error: any) {
    console.error("Login error:", error);
    let message = "Đăng nhập thất bại";
    let status = 401;

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        message =
          error.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu";
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

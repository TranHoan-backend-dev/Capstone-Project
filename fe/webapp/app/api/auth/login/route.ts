import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { signinService } from "@/services/auth.service";
import {
  IS_PRODUCTION,
  MAX_AGE_REFRESH_TOKEN,
} from "@/constants/auth.constants";

const ERROR_TRANSLATIONS: Record<string, string> = {
  "Invalid email or password": "Sai tên đăng nhập hoặc mật khẩu",
  "Bad credentials": "Sai tên đăng nhập hoặc mật khẩu",
};

const translateError = (message?: string, fallback?: string): string => {
  if (!message) return fallback ?? "Có lỗi xảy ra";
  return ERROR_TRANSLATIONS[message] ?? message;
};

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

        console.log("[Login] Backend response status:", status);
        console.log("[Login] Backend response data:", JSON.stringify(responseData, null, 2));

        if (status === 403) {
          return NextResponse.json(
            {
              message: translateError(
                responseData?.message,
                "Tài khoản đã bị khóa hoặc vô hiệu hóa",
              ),
            },
            { status: 403 },
          );
        }

        if (status === 400) {
          return NextResponse.json(
            {
              message: translateError(
                responseData?.message,
                "Sai tên đăng nhập hoặc mật khẩu",
              ),
            },
            { status: 400 },
          );
        }

        if (status === 401) {
          return NextResponse.json(
            {
              message: translateError(
                responseData?.message,
                "Sai tên đăng nhập hoặc mật khẩu",
              ),
              needVerification: responseData?.needVerification || false,
              sessionId: responseData?.sessionId || null,
            },
            { status: 401 },
          );
        }

        // Fallback cho các status khác (bao gồm 500 từ BE)
        return NextResponse.json(
          {
            message: translateError(
              responseData?.message,
              "Sai tên đăng nhập hoặc mật khẩu",
            ),
          },
          { status: status || 400 },
        );
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
      const beMessage = error.response?.data?.message;
      console.log("[Login] Outer catch - status:", error.response?.status, "message:", beMessage);
      message = translateError(beMessage, "Sai tên đăng nhập hoặc mật khẩu");
      status = error.response?.status === 403 ? 403 : 400;
    }

    return NextResponse.json({ message }, { status });
  }
}

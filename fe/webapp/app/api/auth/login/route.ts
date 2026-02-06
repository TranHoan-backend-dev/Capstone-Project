import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { keycloakLogin } from "@/services/keycloak.service";
import { signinService } from "@/services/auth.service";
import {
  IS_PRODUCTION,
} from "@/constants/auth.constants";

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

    const tokenRes = await keycloakLogin({ username, password });

    if (!tokenRes?.access_token) {
      throw new Error("NO_TOKEN");
    }

    let backendData;
    try {
      const backendRes = await signinService(tokenRes.access_token);
      console.log("backendRes", backendRes);
      backendData = backendRes.data?.data;
    } catch (backendError: any) {
  console.log("BACKEND ERROR RAW =====>", backendError);

  if (axios.isAxiosError(backendError)) {
    console.log("STATUS =====>", backendError.response?.status);
    console.log("DATA =====>", backendError.response?.data);

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
      }

      throw backendError;
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
      secure: IS_PRODUCTION,
      sameSite: (IS_PRODUCTION ? "none" : "lax") as "none" | "lax",
      path: "/",
    };

    res.cookies.set(
      IS_PRODUCTION ? "__Secure-access_token" : "access_token",
      tokenRes.access_token,
      {
        ...cookieOptions,
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

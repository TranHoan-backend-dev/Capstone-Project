import { NextRequest, NextResponse } from "next/server";

import { refreshTokenService } from "@/services/auth.service";
import {
  IS_PRODUCTION,
  MAX_AGE_REFRESH_TOKEN,
} from "@/constants/auth.constants";

export async function POST(req: NextRequest) {
  try {
    const refreshToken =
      req.cookies.get("refresh_token")?.value ||
      req.cookies.get("__Secure-refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 },
      );
    }

    const tokenRes = await refreshTokenService(refreshToken);
    const tokenData = tokenRes.data?.data; // Extracting from WrapperApiResponse

    if (!tokenData || !tokenData.access_token) {
      throw new Error("Invalid token data from backend");
    }

    const res = NextResponse.json({ message: "REFRESH_OK" });

    const cookieOptions = {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: (IS_PRODUCTION ? "none" : "lax") as "none" | "lax",
      path: "/",
    };

    res.cookies.set(
      IS_PRODUCTION ? "__Secure-access_token" : "access_token",
      tokenData.access_token,
      {
        ...cookieOptions,
        maxAge: tokenData.expires_in,
      },
    );

    res.cookies.set(
      IS_PRODUCTION ? "__Secure-refresh_token" : "refresh_token",
      tokenData.refresh_token,
      {
        ...cookieOptions,
        maxAge: MAX_AGE_REFRESH_TOKEN,
      },
    );

    return res;
  } catch (err) {
    console.error("Refresh token error:", err);
    return NextResponse.json(
      { message: "Refresh token expired" },
      { status: 401 },
    );
  }
}

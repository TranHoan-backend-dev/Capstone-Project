import {
  IS_PRODUCTION,
  MAX_AGE_REFRESH_TOKEN,
} from "@/constants/auth.constants";
import { NextResponse } from "next/server";

export const setAuthCookies = (
  res: NextResponse,
  tokenRes: {
    access_token?: string;
    accessToken?: string;
    refresh_token?: string;
    refreshToken?: string;
    expires_in?: number;
    expiredTime?: number;
  },
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: (IS_PRODUCTION ? "none" : "lax") as "none" | "lax",
    path: "/",
  };

  const accessToken = tokenRes.access_token || tokenRes.accessToken;
  const refreshToken = tokenRes.refresh_token || tokenRes.refreshToken;
  const accessTokenMaxAge =
    Number(tokenRes.expires_in ?? tokenRes.expiredTime) || 300;

  if (!accessToken) return;


  res.cookies.set(
    IS_PRODUCTION ? "__Secure-access_token" : "access_token",
    accessToken,
    {
      ...cookieOptions,
      maxAge: accessTokenMaxAge,
    }
  );


  if (refreshToken) {
    res.cookies.set(
      IS_PRODUCTION ? "__Secure-refresh_token" : "refresh_token",
      refreshToken,
      {
        ...cookieOptions,
        maxAge: MAX_AGE_REFRESH_TOKEN,
      }
    );
  }
};

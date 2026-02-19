import { IS_PRODUCTION } from "@/constants/auth.constants";
import { NextResponse } from "next/server";

export const setAuthCookies = (
  res: NextResponse,
  tokenRes: { access_token: string; refresh_token: string; expires_in: number }
) => {
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
      maxAge: tokenRes.expires_in,
    }
  );


  res.cookies.set(
    IS_PRODUCTION ? "__Secure-refresh_token" : "refresh_token",
    tokenRes.refresh_token,
    {
      ...cookieOptions,
    }
  );
};

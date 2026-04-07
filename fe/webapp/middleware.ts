import { NextRequest, NextResponse } from "next/server";
import { refreshTokenService } from "@/services/auth.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { getRefreshToken } from "@/utils/getRefreshToken";
import { setAuthCookies } from "@/utils/setAuthCookies";

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/check-existence",
  "/api/auth/verify-otp",
  "/api/auth/reset-password",
];

const EXP_BUFFER_SECONDS = 30;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);

  if (!refreshToken) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!accessToken) {
    return await refreshAndContinue(req, refreshToken);
  }

  const payload = decodeJwtPayload(accessToken);
  const now = Math.floor(Date.now() / 1000);

  if (payload?.exp && payload.exp - EXP_BUFFER_SECONDS > now) {
    return NextResponse.next();
  }

  return await refreshAndContinue(req, refreshToken);
}

async function refreshAndContinue(req: NextRequest, refreshToken: string) {
  try {
    const axiosRes = await refreshTokenService(refreshToken);
    const tokenRes = axiosRes.data?.data;

    if (!tokenRes || !tokenRes.access_token) {
      throw new Error("Invalid token format from backend");
    }

    const res = NextResponse.next();
    setAuthCookies(res, tokenRes);
    return res;
  } catch {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Session expired" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|images|api/public).*)"],
};

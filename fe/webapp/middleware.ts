import { NextRequest, NextResponse } from "next/server";
import { keycloakRefreshToken } from "@/services/keycloak.service";
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
];

const EXP_BUFFER_SECONDS = 30;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);

  if (!refreshToken) {
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
    const tokenRes = await keycloakRefreshToken(refreshToken);
    const res = NextResponse.next();
    setAuthCookies(res, tokenRes);
    return res;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|images|api/public).*)"],
};

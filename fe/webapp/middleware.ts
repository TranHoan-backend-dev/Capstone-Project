import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/refresh",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route),
    )
  ) {
    return NextResponse.next();
  }

  const refreshToken =
    req.cookies.get("refresh_token")?.value ||
    req.cookies.get("__Secure-refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|images|api/public).*)"],
};

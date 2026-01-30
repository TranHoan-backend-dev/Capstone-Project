import { keycloakLogout } from "@/services/keycloak.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json(
    {
      message: "Đăng xuất thành công",
    },
    { status: 200 },
  );

  const refreshToken =
    req.cookies.get("refresh_token")?.value ||
    req.cookies.get("__Secure-refresh_token")?.value;

  if (refreshToken) {
    try {
      await keycloakLogout(refreshToken);
    } catch (error) {
      console.warn("Keycloak logout failed", error);
    }
  }
  res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("__Secure-access_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("__Secure-refresh_token", "", { maxAge: 0, path: "/" });
  
  return res;
}

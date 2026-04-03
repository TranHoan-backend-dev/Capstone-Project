import { keycloakLogout } from "@/services/keycloak.service";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("Logout API called", {
    url: req.url,
    method: req.method,
    cookies: req.cookies.getAll().map((c) => c.name),
  });

  const refreshToken =
    req.cookies.get("refresh_token")?.value ||
    req.cookies.get("__Secure-refresh_token")?.value;

  // Gọi logout Keycloak nếu có token
  if (refreshToken) {
    try {
      await keycloakLogout(refreshToken);
      console.log("Keycloak logout successful");
    } catch (error) {
      // Log chi tiết nhưng không throw để vẫn xóa cookies
      console.warn(
        "Keycloak logout failed, but continuing to clear local cookies:",
        error instanceof Error ? error.message : error,
      );
    }
  } else {
    console.log("No refresh token found, skipping Keycloak logout");
  }

  // Tạo response
  const res = NextResponse.json(
    {
      message: "Đăng xuất thành công",
    },
    { status: 200 },
  );

  // Xác định môi trường
  const isProduction = process.env.NODE_ENV === "production";
  const domain = isProduction ? process.env.NEXT_PUBLIC_DOMAIN : undefined;

  // Cấu hình cookie để xóa
  const cookieOptions = {
    maxAge: 0,
    path: "/",
    domain: domain,
    secure: isProduction,
    sameSite: "lax" as const,
    httpOnly: true,
  };

  // Xóa tất cả cookies
  res.cookies.set("access_token", "", cookieOptions);
  res.cookies.set("refresh_token", "", cookieOptions);

  // Chỉ set __Secure- cookies khi ở production
  if (isProduction) {
    res.cookies.set("__Secure-access_token", "", {
      ...cookieOptions,
      secure: true,
    });
    res.cookies.set("__Secure-refresh_token", "", {
      ...cookieOptions,
      secure: true,
    });
  }

  return res;
}

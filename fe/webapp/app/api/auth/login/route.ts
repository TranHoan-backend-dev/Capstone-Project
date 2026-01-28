import { NextRequest, NextResponse } from "next/server";
import { keycloakLogin } from "@/services/keycloak.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { username, password } = body;

    const tokenRes = await keycloakLogin({ username, password });

    const res = NextResponse.json({
      user: tokenRes,
    });

    res.cookies.set("access_token", tokenRes.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenRes.expires_in,
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set("refresh_token", tokenRes.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Đăng nhập thất bại" },
      { status: 401 },
    );
  }
}

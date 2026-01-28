import { NextRequest, NextResponse } from "next/server";
import { keycloakLogin } from "@/services/keycloak.service";
import { signinService } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const tokenRes = await keycloakLogin({ username, password });

    const backendRes = await signinService(tokenRes.access_token);

    const res = NextResponse.json({
      user: backendRes.data,
    });

    res.cookies.set("access_token", tokenRes.access_token, {
      httpOnly: true,
      secure: true,
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

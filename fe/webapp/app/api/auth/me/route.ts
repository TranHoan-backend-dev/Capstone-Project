import { getProfileEmployee } from "@/services/auth.service";
import { keycloakRefreshToken } from "@/services/keycloak.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { getRefreshToken } from "@/utils/getRefreshToken";
import { setAuthCookies } from "@/utils/setAuthCookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);
   
    if (!accessToken) {
      return NextResponse.json(
        { message: "Không có access token" },
        { status: 401 }
      );
    }


    try {
      const profile = await getProfileEmployee(accessToken);
      return NextResponse.json(profile);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const refreshToken = getRefreshToken(req);
       
        if (refreshToken) {
          try {
            const tokenRes = await keycloakRefreshToken(refreshToken);
           
            const profile = await getProfileEmployee(tokenRes.access_token);
           
            const response = NextResponse.json(profile);
            setAuthCookies(response, tokenRes);
           
            return response;
          } catch (refreshError) {
            return NextResponse.json(
              { message: "Refresh token expired" },
              { status: 401 }
            );
          }
        }
      }
     
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}

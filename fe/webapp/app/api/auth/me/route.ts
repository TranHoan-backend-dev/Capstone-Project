import { getProfileEmployee, updateProfileEmployee } from "@/services/auth.service";
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const allowedPayload = {
      avatarUrl: body.avatarUrl,
      fullName: body.fullname,
      phoneNumber: body.phoneNumber,
      gender: body.gender,
      birthdate: body.birthday,
      address: body.address,
    };

    const payload = Object.fromEntries(
      Object.entries(allowedPayload).filter(([, v]) => v !== undefined),
    );

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { message: "Không có dữ liệu để cập nhật" },
        { status: 400 },
      );
    }

    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return NextResponse.json(
        { message: "Không tìm thấy access token" },
        { status: 401 },
      );
    }

    const updateProfile = await updateProfileEmployee(payload, accessToken);
    return NextResponse.json({
      status: 200,
      message: "Cập nhật thành công",
      data: updateProfile,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Không thể cập nhật thông tin người dùng" },
      { status: 500 },
    );
  }
}

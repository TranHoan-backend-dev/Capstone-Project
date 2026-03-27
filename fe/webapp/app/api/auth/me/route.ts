import {
  getProfileEmployee,
  updateProfileEmployee,
} from "@/services/auth.service";
import { keycloakRefreshToken } from "@/services/keycloak.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { getRefreshToken } from "@/utils/getRefreshToken";
import { validateProfile } from "@/utils/profileValidation";
import { setAuthCookies } from "@/utils/setAuthCookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json(
        { message: "Không có access token" },
        { status: 401 },
      );
    }

    const profile = await getProfileEmployee(accessToken);
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const allowedPayload = {
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      gender: body.gender,
      birthdate: body.birthdate,
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
    const validationError = validateProfile(payload);

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
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

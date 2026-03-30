import {
  getProfileEmployee,
  updateProfileEmployee,
} from "@/services/auth.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { validateProfile } from "@/utils/profileValidation";
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

    try {
      // Gọi API đến backend của bạn (không qua Keycloak)
      const profile = await getProfileEmployee(accessToken);
      return NextResponse.json(profile);
    } catch (error: any) {
      // Xử lý lỗi 401 từ backend
      if (error?.response?.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        return NextResponse.json(
          { message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" },
          { status: 401 },
        );
      }

      // Các lỗi khác
      throw error;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống, vui lòng thử lại sau" },
      { status: 500 },
    );
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

    const updatedProfile = await updateProfileEmployee(payload, accessToken);
    return NextResponse.json({
      status: 200,
      message: "Cập nhật thành công",
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);

    // Xử lý lỗi từ backend
    if (error?.response?.status === 401) {
      return NextResponse.json(
        { message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" },
        { status: 401 },
      );
    }

    if (error?.response?.status === 403) {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện hành động này" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ||
          "Không thể cập nhật thông tin người dùng",
      },
      { status: error?.response?.status || 500 },
    );
  }
}

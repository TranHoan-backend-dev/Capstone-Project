import { approveInstallationForm } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json(
        { message: "Không tìm thấy access token" },
        { status: 401 },
      );
    }

    if (!body?.formCode || !body?.formNumber) {
      return NextResponse.json(
        { message: "Thiếu thông tin form" },
        { status: 400 },
      );
    }

    const approveInstallation = await approveInstallationForm(
      accessToken,
      body,
    );

    if (!approveInstallation?.ok) {
      return NextResponse.json(
        {
          message: approveInstallation?.message || "Cập nhật thất bại",
        },
        { status: approveInstallation?.status || 400 },
      );
    }

    return NextResponse.json({
      message: "Cập nhật thành công",
      data: approveInstallation,
    });
  } catch (error: any) {
    console.error("Approve installation error:", error);

    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể cập nhật thông tin đơn",
      },
      { status: error?.response?.status || 500 },
    );
  }
}

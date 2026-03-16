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

    console.log("payload", body);
    const approveInstallation = await approveInstallationForm(
      accessToken,
      body,
    );

    return NextResponse.json({
      status: 200,
      message: "Cập nhật thành công",
      data: approveInstallation,
    });
  } catch (error) {
    console.error("Approve installation error:", error);

    return NextResponse.json(
      { message: "Không thể cập nhật thông tin đơn" },
      { status: 500 },
    );
  }
}

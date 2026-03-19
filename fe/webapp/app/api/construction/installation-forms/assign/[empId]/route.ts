import { assignInstallationForm } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ empId: string }> },
) {
  const { empId } = await context.params;

  const body = await req.json();
  const accessToken = getAccessToken(req);
  const { formCode, formNumber } = body;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Không tìm thấy access token" },
      { status: 401 },
    );
  }

  if (!formCode || !formNumber) {
    return NextResponse.json(
      { message: "Thiếu thông tin form" },
      { status: 400 },
    );
  }

  const result = await assignInstallationForm(
    accessToken,
    empId,
    formCode,
    formNumber,
  );

  return NextResponse.json({
    message: "Cập nhật thành công",
    data: result,
  });
}

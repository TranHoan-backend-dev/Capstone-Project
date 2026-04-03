import { getInstallationFormById } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return NextResponse.json(
      { message: "Không tìm thấy access token" },
      { status: 401 },
    );
  }

  const result = await getInstallationFormById(accessToken, id);

  return NextResponse.json({
    message: "Cập nhật thành công",
    data: result,
  });
}

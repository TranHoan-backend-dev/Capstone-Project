import { getInstallationFormByCode } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ formCode: string; formNumber: string }> },
) {
  const { formCode, formNumber } = await context.params;
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return NextResponse.json(
      { message: "Không tìm thấy access token" },
      { status: 401 },
    );
  }

  const response = await getInstallationFormByCode(
    accessToken,
    formCode,
    formNumber,
  );
  return NextResponse.json(response.data);
}

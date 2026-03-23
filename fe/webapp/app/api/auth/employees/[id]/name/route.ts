import { getEmployeeById } from "@/services/authorization.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ estimateId: string }> },
) {
  const { estimateId } = await context.params;
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await getEmployeeById(accessToken, estimateId);

    return NextResponse.json(
      {
        message: "Lấy thông tin nhân viên thành công",
        data: response.data.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    return NextResponse.json(
      {
        message: error?.response?.data?.message ?? "Internal Server Error",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}
import { getEstimateByFormCode } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formCode: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { formCode } = await params;

    const response = await getEstimateByFormCode(accessToken, formCode);

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error?.response?.status ?? 500;

    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ?? "Lấy dữ liệu dự toán thất bại",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

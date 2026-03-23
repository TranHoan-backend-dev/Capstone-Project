import { requestEstimateSignature } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ estimateId: string }> },
) {
  const { estimateId } = await context.params;
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await requestEstimateSignature(accessToken, estimateId);

    return NextResponse.json(
      {
        message: "Yêu cầu ký duyệt dự toán đã được gửi thành công",
        data: response.data.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ??
          "Gửi yêu cầu ký duyệt thất bại",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

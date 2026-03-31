import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { reviewConstruction } from "@/services/construction.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; status: string }> },
) {
  try {
    const accessToken = getAccessToken(req);
    const { id, status } = await params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const isApproved = status === 'true';
    const response = await reviewConstruction(accessToken, id, isApproved);

    return NextResponse.json(
      {
        message: "Cập nhật trạng thái công trình thành công",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          "Cập nhật trạng thái công trình thất bại",
        error: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

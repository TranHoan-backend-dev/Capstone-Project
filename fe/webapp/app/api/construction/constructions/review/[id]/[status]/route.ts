import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { reviewConstruction } from "@/services/construction.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; status: boolean }> },
) {
  try {
    const accessToken = getAccessToken(req);
    const { id, status } = await params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await reviewConstruction(accessToken, id, status);

    return NextResponse.json(
      {
        message: "Cập nhật nhân viên thi công thành công",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          "Cập nhật nhân viên thi công thất bại",
        error: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

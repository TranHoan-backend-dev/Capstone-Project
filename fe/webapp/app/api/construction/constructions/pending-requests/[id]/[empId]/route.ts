import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { updateConstructionStaff } from "@/services/construction.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; empId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);
    const { id, empId } = await params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await updateConstructionStaff(accessToken, id, empId);

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

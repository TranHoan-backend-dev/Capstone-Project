import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { deleteReceipt } from "@/services/construction.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ formCode: string; formNumber: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { formCode, formNumber } = await params;

    const response = await deleteReceipt(accessToken, formCode, formNumber);

    return NextResponse.json(
      {
        message: "Xóa phiếu thu thành công",
        data: response.data,
      },
      { status: response.status },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || error?.message || "Delete failed",
      },
      { status: error?.response?.status ?? 500 },
    );
  }
}

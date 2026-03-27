import { NextRequest, NextResponse } from "next/server";
import { deleteContract } from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const response = await deleteContract(accessToken, id);

    return NextResponse.json(
      {
        message: "Xóa hợp đồng thành công",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting contract:", error);
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

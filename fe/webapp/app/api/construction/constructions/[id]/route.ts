import { createAndAssignToConstructionCaptain } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { formCode, formNumber, contractId } = await req.json();

    const response = await createAndAssignToConstructionCaptain(
      accessToken,
      id,
      formCode,
      formNumber,
      contractId,
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Cập nhật thôn làng thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

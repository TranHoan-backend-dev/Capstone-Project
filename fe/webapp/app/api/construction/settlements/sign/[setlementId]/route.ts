import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { signSettlement } from "@/services/construction.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ setlementId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { setlementId } = await params;
    const { electronicSignUrl } = body;

    if (!setlementId) {
      return NextResponse.json(
        { message: "settlementId is required" },
        { status: 400 },
      );
    }

    const response = await signSettlement(
      accessToken,
      setlementId,
      electronicSignUrl,
    );

    return NextResponse.json(
      {
        message: "Tạo quyết toán công trình thành công",
        data: response.data,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Tạo quyết toán thất bại",
        error: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

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

    const { url } = body;
    if (!setlementId) {
      return NextResponse.json(
        { message: "settlementId is required" },
        { status: 400 },
      );
    }

    const response = await signSettlement(accessToken, setlementId, url);

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Ký duyệt quyết toán thất bại",
        error: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

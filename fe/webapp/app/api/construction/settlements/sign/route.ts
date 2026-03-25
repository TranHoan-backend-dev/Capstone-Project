import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import {
  requestSignSettlement,
} from "@/services/construction.service";

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      settlementId,
      companyLeadership,
      plHead,
      surveyStaff,
      constructionPresident,
    } = body;

    if (!settlementId) {
      return NextResponse.json(
        { message: "settlementId is required" },
        { status: 400 },
      );
    }

    const response = await requestSignSettlement(
      accessToken,
      settlementId,
      surveyStaff,
      plHead,
      companyLeadership,
      constructionPresident,
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

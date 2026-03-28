import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

import { getReviewedEstimateForms } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await getReviewedEstimateForms(accessToken);

    return NextResponse.json(
      {
        message: "Lấy danh sách đơn đã duyệt dự toán thành công",
        data: response.data.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
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

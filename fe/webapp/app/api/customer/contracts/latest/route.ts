import { getLastCodeContract } from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await getLastCodeContract(accessToken);

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error?.response?.status ?? 500;

    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ?? "Lấy mã hợp đồng cuối cùng thất bại",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

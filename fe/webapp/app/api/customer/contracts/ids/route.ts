import { getContractByFormCodeAndFormNumber } from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("API called with URL:", req.url);
    console.log("FormCode:", req.nextUrl.searchParams.get("formCode"));
    console.log("FormNumber:", req.nextUrl.searchParams.get("formNumber"));
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const formCode = searchParams.get("formCode");
    const formNumber = searchParams.get("formNumber");

    if (!formCode || !formNumber) {
      return NextResponse.json(
        { message: "formCode and formNumber are required" },
        { status: 400 },
      );
    }

    const response = await getContractByFormCodeAndFormNumber(
      accessToken,
      formCode,
      formNumber,
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching contract id:", error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Lấy thông tin hợp đồng thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

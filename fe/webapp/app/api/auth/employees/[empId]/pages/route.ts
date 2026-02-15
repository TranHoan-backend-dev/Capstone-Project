import { getBusinessPageNamesOfEmployees } from "@/services/authorization.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { empId: string } },
) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { empId } = params;
    const response = await getBusinessPageNamesOfEmployees(accessToken, empId);

    return NextResponse.json(
      {
        message: "Lấy danh sách quyền truy cập thành công",
        data: response.data.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

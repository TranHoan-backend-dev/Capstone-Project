import { NextRequest, NextResponse } from "next/server";
import { getContractByFormCode } from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { code } = await params;
    const response = await getContractByFormCode(accessToken, code);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching contract by form code:", error);
    const status = error?.response?.status ?? 500;

    return NextResponse.json(
      {
        message:
          error?.response?.data?.message ?? "Internal Server Error",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getEstimateMeterType } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const response = await getEstimateMeterType(accessToken, id);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching estimate meter type:", error);
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

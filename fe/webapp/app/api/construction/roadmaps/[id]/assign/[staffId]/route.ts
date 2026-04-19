import { assignRoadmapStaff } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; staffId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, staffId } = await context.params;
    const response = await assignRoadmapStaff(accessToken, id, staffId);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.response?.data?.message || "Phân công lộ trình thất bại",
      },
      { status: error?.response?.status || 500 },
    );
  }
}

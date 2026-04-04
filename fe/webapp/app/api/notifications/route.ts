import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { getAllNotifications } from "@/services/notification.service";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 0;
    const size = Number(searchParams.get("size")) || 5;

    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await getAllNotifications(accessToken, page, size);

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({});
  }
}

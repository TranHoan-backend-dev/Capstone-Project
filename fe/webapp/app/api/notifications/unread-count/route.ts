import { NextRequest, NextResponse } from "next/server";

import { getAccessToken } from "@/utils/getAccessToken";
import { getUnreadCount } from "@/services/notification.service";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await getUnreadCount(accessToken);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API Error [unread-count]:", error);
    return NextResponse.json({ data: 0 });
  }
}

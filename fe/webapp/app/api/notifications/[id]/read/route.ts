import { NextRequest, NextResponse } from "next/server";

import { getAccessToken } from "@/utils/getAccessToken";
import { markAsRead } from "@/services/notification.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = getAccessToken(req);
    const notificationId = params.id;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await markAsRead(accessToken, notificationId);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`API Error [mark-read] - ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}

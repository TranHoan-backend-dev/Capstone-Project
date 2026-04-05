import { NextRequest, NextResponse } from "next/server";

import { getAccessToken } from "@/utils/getAccessToken";
import { markAsRead } from "@/services/notification.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: notificationId } = await params;
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await markAsRead(accessToken, notificationId);

    return NextResponse.json(response.data);
  } catch (error) {
    const { id } = await params;
    console.error(`API Error [mark-read] - ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}

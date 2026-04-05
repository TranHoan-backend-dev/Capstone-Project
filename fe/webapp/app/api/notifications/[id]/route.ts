import { NextRequest, NextResponse } from "next/server";

import { getAccessToken } from "@/utils/getAccessToken";
import { deleteNotification } from "@/services/notification.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: notificationId } = await params;
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await deleteNotification(accessToken, notificationId);

    return NextResponse.json(response.data);
  } catch (error) {
    const { id } = await params;
    console.error(`API Error [delete] - ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}

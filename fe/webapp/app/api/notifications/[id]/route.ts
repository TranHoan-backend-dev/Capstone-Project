import { NextRequest, NextResponse } from "next/server";

import { getAccessToken } from "@/utils/getAccessToken";
import { deleteNotification } from "@/services/notification.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = getAccessToken(req);
    const notificationId = params.id;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await deleteNotification(accessToken, notificationId);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`API Error [delete] - ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}

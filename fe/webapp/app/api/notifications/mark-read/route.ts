import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notificationId } = body;

    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gọi API backend để đánh dấu đã đọc
    // const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    //   method: "PUT",
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // Tạm thời trả về thành công
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}

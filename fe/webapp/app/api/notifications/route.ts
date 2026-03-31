// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "@/utils/getAccessToken";

// Giả sử bạn có API từ BE để lấy notifications
const NOTIFICATION_API_URL =
  process.env.NOTIFICATION_API_URL || "http://localhost:8080/api/notifications";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const accessToken = getAccessToken(req);


    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${NOTIFICATION_API_URL}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching notifications:", error);

    // Fallback: trả về mock data nếu BE chưa có API
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
      total: 0,
      page: 1,
      totalPages: 0,
    });
  }
}

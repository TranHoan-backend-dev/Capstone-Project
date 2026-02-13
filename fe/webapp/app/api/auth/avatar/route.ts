import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { updateAvatar } from "@/services/auth.service";

export async function PUT(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const avatar = formData.get("avatar");

    if (!(avatar instanceof File)) {
      return NextResponse.json(
        { message: "Avatar file is required" },
        { status: 400 },
      );
    }

    const data = await updateAvatar(avatar, accessToken);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Upload avatar error:", error?.response?.data || error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

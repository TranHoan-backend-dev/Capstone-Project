import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import { updateAvatar } from "@/services/auth.service";
export async function PATCH(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const avatar = formData.get("avatar");

    if (!avatar) {
      return NextResponse.json(
        { message: "Avatar file is required" },
        { status: 400 },
      );
    }

    const file = avatar as Blob;

    const backendForm = new FormData();
    backendForm.append("avatar", file);

    const data = await updateAvatar(backendForm, accessToken);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || "Internal server error" },
      { status: 500 },
    );
  }
}

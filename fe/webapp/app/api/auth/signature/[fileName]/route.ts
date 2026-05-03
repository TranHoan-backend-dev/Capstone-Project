import { getSignatureImage } from "@/services/auth.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileName: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { fileName } = await params;

    const response = await getSignatureImage(accessToken, fileName);

    const ext = fileName.toLowerCase().split(".").pop();
    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    const contentType = contentTypeMap[ext || ""] || "image/jpeg";

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch signature";

    return NextResponse.json({ message }, { status });
  }
}

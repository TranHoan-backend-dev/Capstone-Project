import { createRoadmap, getAllRoadmaps } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const sort = searchParams.get("sort") || "createdAt,desc";
    const networkId = searchParams.get("networkId") || undefined;
    const lateralId = searchParams.get("lateralId") || undefined;
    const keyword = searchParams.get("keyword") || "";

    const response = await getAllRoadmaps(
      accessToken,
      page ? Number(page) : 0,
      size ? Number(size) : 1000,
      networkId,
      lateralId,
      keyword,
    );

    return NextResponse.json(
      {
        message: "Lấy danh sách lộ trình cấp nước thành công",
        data: response.data.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;

    return NextResponse.json(
      {
        message: error?.response?.data?.message ?? "Internal Server Error",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { name, networkId, lateralId } = await req.json();

    const response = await createRoadmap(
      accessToken,
      name,
      networkId,
      lateralId,
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Create network failed",
      },
      { status: error.response?.status || 500 },
    );
  }
}

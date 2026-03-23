import { createCommune, getAllCommunes } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

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
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";

    const response = await getAllCommunes(
      accessToken,
      page ? Number(page) : 0,
      size ? Number(size) : 1000,
      sort,
      search,
      type,
    );

    return NextResponse.json(response.data.data, { status: 200 });
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
    const { name, type } = await req.json();

    const response = await createCommune(accessToken, name, type);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Tạo phường xã thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

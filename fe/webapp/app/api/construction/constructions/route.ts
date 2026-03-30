import { getAllConstruction } from "@/services/construction.service";
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
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    // const sort = searchParams.get("sort") || "name,desc";
    const keyword = searchParams.get("keyword") || undefined;

    const response = await getAllConstruction(
      accessToken,
      page,
      size,
      // sort,
      keyword,
    );

    return NextResponse.json(response.data);
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

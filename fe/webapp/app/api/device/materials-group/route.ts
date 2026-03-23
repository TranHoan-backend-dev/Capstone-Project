import {
  createMaterialGroup,
  getAllMaterialsGroup,
} from "@/services/device.service";
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
    const sort = searchParams.get("sort") || "name,desc";
    const filter = searchParams.get("filter") || "";

    const response = await getAllMaterialsGroup(
      accessToken,
      page,
      size,
      sort,
      filter,
    );

    return NextResponse.json(
      {
        message: "Lấy danh sách nhóm vật tư thành công",
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
    const { name } = await req.json();

    const response = await createMaterialGroup(accessToken, name);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Thêm mới nhóm vật tư thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

import { createType, getAllTypes } from "@/services/device.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    const sort = searchParams.get("sort") || "createdAt,desc";

    const response = await getAllTypes(accessToken, page, size, sort);

    return NextResponse.json(
      {
        message: "Lấy danh sách chi nhánh cấp nước thành công",
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
    const { name, origin, meterModel, size, maxIndex, diameter, qn, qt, qmin } =
      await req.json();

    const response = await createType(
      accessToken,
      name,
      origin,
      meterModel,
      size,
      maxIndex,
      diameter,
      qn,
      qt,
      qmin,
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Thêm mới loại đồng hồ thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

import { createType, getAllTypes, searchMeterTypes } from "@/services/device.service";
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

    const filterFields = ["name", "origin", "meterModel", "maxIndex", "qn", "qt", "qmin"];
    const numberFields = ["meterSize", "diameter"];

    const body: Record<string, string | number | undefined> = {};
    let hasFilter = false;

    for (const field of filterFields) {
      const val = searchParams.get(field);
      if (val && val.trim()) {
        body[field] = val.trim();
        hasFilter = true;
      }
    }

    // "meterSize" trên FE map sang "size" trong BE body để tránh xung đột với pagination param "size"
    const sizeVal = searchParams.get("meterSize");
    if (sizeVal && sizeVal.trim()) {
      const num = Number(sizeVal.trim());
      if (!isNaN(num)) {
        body["size"] = num;
        hasFilter = true;
      }
    }

    const diameterVal = searchParams.get("diameter");
    if (diameterVal && diameterVal.trim()) {
      const num = Number(diameterVal.trim());
      if (!isNaN(num)) {
        body["diameter"] = num;
        hasFilter = true;
      }
    }

    let response;
    if (hasFilter) {
      response = await searchMeterTypes(accessToken, body, page, size, sort);
    } else {
      response = await getAllTypes(accessToken, page, size, sort);
    }

    return NextResponse.json(
      {
        message: "Lấy danh sách loại đồng hồ nước thành công",
        data: response.data.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    console.error("[water-meter-type GET] error:", JSON.stringify(error?.response?.data ?? error?.message));

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
    const { name, origin, meterModel, size, maxIndex, diameter, qn, qt, qmin, indexLength } =
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
      indexLength,
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

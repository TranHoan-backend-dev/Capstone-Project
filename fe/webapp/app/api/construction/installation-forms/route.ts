import {
  createNewInstallationForm,
  getInstallationForms,
} from "@/services/construction.service";
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
    const sort = searchParams.get("sort") || "createdAt,desc";
    const keyword = searchParams.get("keyword") || undefined;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    const response = await getInstallationForms(
      accessToken,
      page,
      size,
      sort,
      keyword,
      from,
      to,
    );

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
    const payload = await req.json();

    const response = await createNewInstallationForm(accessToken, payload);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.response?.data?.message || "Tạo đơn thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

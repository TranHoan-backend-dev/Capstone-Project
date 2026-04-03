import {
  createEmployee,
  getAllEmployees,
} from "@/services/authorization.service";
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
    const isEnabledParam = searchParams.get("isEnabled");
    const isEnabled =
      isEnabledParam !== null ? isEnabledParam === "true" : undefined;

    const username = searchParams.get("username") || undefined;

    const response = await getAllEmployees(
      accessToken,
      page,
      size,
      isEnabled,
      username,
    );

    return NextResponse.json(
      {
        message: "Lấy danh sách nhân viên thành công",
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

    const body = await req.json();

    const response = await createEmployee(accessToken, body);

    return NextResponse.json(
      {
        message: "Thêm nhân viên thành công",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    return NextResponse.json(
      {
        message: error?.response?.data?.message || "Thêm nhân viên thất bại",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

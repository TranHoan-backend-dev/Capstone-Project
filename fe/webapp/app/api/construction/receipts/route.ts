import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import {
  createReceipt,
  getAllReceipts,
  updateReceipt,
} from "@/services/construction.service";

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

    const keyword = searchParams.get("filter") || "";
    const fromDate = searchParams.get("fromDate") || undefined;
    const toDate = searchParams.get("toDate") || undefined;
    const isPaid = searchParams.get("isPaid") || undefined;

    const response = await getAllReceipts(
      accessToken,
      page,
      size,
      sort,
      keyword,
      fromDate,
      toDate,
      isPaid,
    );

    return NextResponse.json(
      {
        message: "Lấy danh sách phiếu thu thành công",
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
    const response = await createReceipt(accessToken, body);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (error.isAxiosError) {
      console.error("Axios error response:", error.response?.data);
      console.error("Axios error status:", error.response?.status);
    } else {
      console.error("Unexpected error:", error);
    }

    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || error?.message || "Create failed",
      },
      { status: error?.response?.status || 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const response = await updateReceipt(accessToken, body);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || error?.message || "Update failed",
      },
      { status: error?.response?.status || 500 },
    );
  }
}

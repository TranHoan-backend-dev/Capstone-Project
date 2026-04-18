import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import {
  getAllSettlements,
  createSettlement,
  filterSettlements,
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
    // const sort = searchParams.get("sort") || ",desc";

    // FE có thể gửi cả `search` hoặc `keyword`
    const search = searchParams.get("search") ?? searchParams.get("keyword");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const status = searchParams.get("status");

    const hasFilter = search || fromDate || toDate || status;

    if (hasFilter) {
      const filterRequest = {
        search: search || null,
        status: status ? [status] : null,
        registrationFrom: fromDate || null,
        registrationTo: toDate || null,
        connectionFeeMin: null,
        connectionFeeMax: null,
        createdAtFrom: null,
        createdAtTo: null,
      };
      const response1 = await filterSettlements(
        accessToken,
        filterRequest,
        page,
        size,
        // sort,
      );

      return NextResponse.json(
        {
          message: "Lọc quyết toán thành công",
          data: response1.data.data,
        },
        { status: 200 },
      );
    }

    const response = await getAllSettlements(accessToken, page, size);

    return NextResponse.json(
      {
        message: "Lấy danh sách quyết toán thành công",
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

    const payload =
      body?.status === undefined
        ? body
        : {
            ...body,
            status: Array.isArray(body.status) ? body.status : [body.status],
          };

    const response = await createSettlement(accessToken, payload);

    return NextResponse.json(
      {
        message: "Tạo quyết toán công trình thành công",
        data: response.data,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Tạo quyết toán thất bại",
        error: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

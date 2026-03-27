import { NextRequest, NextResponse } from "next/server";
import { createContract, getAllContracts } from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";

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

    const filters: Record<string, any> = {};

    const response = await getAllContracts(
      accessToken,
      page,
      size,
      sort,
      filters,
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

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const response = await createContract(accessToken, body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          error.message ||
          "Internal server error",
        details: error.response?.data,
      },
      { status: error.response?.status || 500 },
    );
  }
}

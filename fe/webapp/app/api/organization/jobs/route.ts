import { createJob, getAllJobs } from "@/services/organization.service";
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
    const name = searchParams.get("name") || "";
    const fromDate = searchParams.get("fromDate") || "";
    const toDate = searchParams.get("toDate") || "";

    const response = await getAllJobs(
      accessToken,
      page,
      size,
      sort,
      name,
      fromDate,
      toDate,
    );

    return NextResponse.json(
      {
        message: "Lấy danh sách công việc thành công",
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

    const response = await createJob(accessToken, name);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Thêm công việc thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

import {
  updateEstimate,
  getEstimateById,
  approveEstimate,
} from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ estimateId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { estimateId } = await params;

    const response = await getEstimateById(accessToken, estimateId);

    return NextResponse.json(
      {
        message: "Lấy dữ liệu thành công",
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ estimateId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { estimateId } = await params;

    const formData = await req.formData();

    const response = await updateEstimate(accessToken, estimateId, formData);

    return NextResponse.json(
      {
        message: "Cập nhật thành công",
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ estimateId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { status, estimateId } = await req.json();

    const response = await approveEstimate(accessToken, estimateId, status);

    return NextResponse.json(
      {
        message: "Phê duyệt thành công",
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

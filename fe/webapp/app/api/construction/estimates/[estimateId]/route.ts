import {
  approveEstimate,
  getEstimateById,
  updateEstimate,
} from "@/services/construction.service";
import { UpdateEstimateRequest } from "@/types";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ estimateId: string }> },
) {
  const { estimateId } = await context.params;
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await getEstimateById(accessToken, estimateId);

    return NextResponse.json(
      {
        message: "Lấy thông tin dự toán thành công",
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
    const updateRequest = await req.json();

    try {
      const response = await updateEstimate(
        accessToken,
        estimateId,
        updateRequest,
      );

      return NextResponse.json(
        {
          message: "Cập nhật dự toán thành công",
          data: response.data.data,
        },
        { status: 200 },
      );
    } catch (axiosError: any) {
      return NextResponse.json(
        {
          message:
            axiosError.response?.data?.message || "Error calling backend",
          error: axiosError.response?.data || null,
        },
        { status: axiosError.response?.status || 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message ?? "Internal Server Error",
        error: error?.response?.data ?? null,
      },
      { status: 500 },
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

    const { estimateId } = await params;
    const status = await req.json();

    try {
      const response = await approveEstimate(
        accessToken,
        estimateId,
        status,
      );

      return NextResponse.json(
        {
          message: "Duyệt dự toán thành công",
          data: response.data.data,
        },
        { status: 200 },
      );
    } catch (axiosError: any) {
      console.error("Axios error details:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      return NextResponse.json(
        {
          message:
            axiosError.response?.data?.message || "Error calling backend",
          error: axiosError.response?.data || null,
        },
        { status: axiosError.response?.status || 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message ?? "Internal Server Error",
        error: error?.response?.data ?? null,
      },
      { status: 500 },
    );
  }
}

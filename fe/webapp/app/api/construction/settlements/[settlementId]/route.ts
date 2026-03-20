import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/getAccessToken";
import {
  getSettlementById,
  updateSettlement,
  deleteSettlement,
} from "@/services/construction.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ settlementId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);
    const { settlementId } = await params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await getSettlementById(accessToken, settlementId);

    return NextResponse.json(
      {
        message: "Lấy thông tin quyết toán thành công",
        data: response.data,
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
  { params }: { params: Promise<{ settlementId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);
    const { settlementId } = await params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const response = await updateSettlement(accessToken, settlementId, body);

    return NextResponse.json(
      {
        message: "Cập nhật quyết toán thành công",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Cập nhật quyết toán thất bại",
        error: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ settlementId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);
    const { settlementId } = await params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await deleteSettlement(accessToken, settlementId);

    return NextResponse.json(
      {
        message: "Xóa quyết toán thành công",
        data: null,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Xóa quyết toán thất bại",
        error: error.response?.data || null,
      },
      { status: error.response?.status || 500 },
    );
  }
}

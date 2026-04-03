import {
  deleteEmployee,
  updateEmployee,
} from "@/services/authorization.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ empId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { empId } = await params;
    const body = await req.json();

    const response = await updateEmployee(accessToken, empId, body);

    return NextResponse.json(
      {
        message: "Cập nhật nhân viên thành công",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    return NextResponse.json(
      {
        message:
          error?.response?.data?.message || "Cập nhật nhân viên thất bại",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ empId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { empId } = await params;

    const response = await deleteEmployee(accessToken, empId);

    return NextResponse.json(
      {
        message: "Xóa nhân viên thành công",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    return NextResponse.json(
      {
        message: error?.response?.data?.message || "Xóa nhân viên thất bại",
        error: error?.response?.data ?? null,
      },
      { status },
    );
  }
}

import {
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);
    const { customerId } = await params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await getCustomerById(accessToken, customerId);

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = await params;

    const response = await deleteCustomer(accessToken, customerId);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Xóa khách hàng thất bại",
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { customerId } = await params;
    const body = await req.json();
    const response = await updateCustomer(accessToken, body, customerId);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

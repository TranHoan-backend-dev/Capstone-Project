import { deleteNeighborhoodUnits, updateNeighborhoodUnits } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, communeId } = await req.json();

    const response = await updateNeighborhoodUnits(accessToken, id, name, communeId);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Update commune failed",
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const response = await deleteNeighborhoodUnits(accessToken, id);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Update commune failed",
      },
      { status: error.response?.status || 500 },
    );
  }
}

import { deleteLateral, updateLateral } from "@/services/construction.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    id: string;
  };
};

export async function PUT(req: NextRequest, context: Context) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const { name, networkId } = await req.json();

    const response = await updateLateral(accessToken, id, name, networkId);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Update lateral failed",
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;

    const response = await deleteLateral(accessToken, id);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Delete lateral failed",
      },
      { status: error.response?.status || 500 },
    );
  }
}

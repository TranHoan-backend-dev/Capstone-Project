import { getAllMaterials } from "@/services/device.service";
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
    const response = await getAllMaterials(accessToken, page, size);

    return NextResponse.json(
      {
        message: "Lấy danh sách nhóm vật tư thành công",
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

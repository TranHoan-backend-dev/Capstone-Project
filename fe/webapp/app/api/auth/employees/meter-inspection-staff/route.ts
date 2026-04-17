import { getAllEmployees } from "@/services/authorization.service";
import { getAccessToken } from "@/utils/getAccessToken";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

type EmployeeRecord = {
  id: string;
  userId?: string;
  fullName: string;
  username?: string;
  role?: string;
  roles?: string[];
};

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    const username = searchParams.get("username") || undefined;
    const batchSize = 200;
    const firstResponse = await getAllEmployees(
      accessToken,
      0,
      batchSize,
      true,
      username,
    );
    const firstData = firstResponse?.data?.data;
    const firstContent: EmployeeRecord[] = firstData?.content ?? [];
    const backendTotalPages =
      firstData?.totalPages ?? firstData?.page?.totalPages ?? 1;

    let allEmployees: EmployeeRecord[] = [...firstContent];

    for (let currentPage = 1; currentPage < backendTotalPages; currentPage++) {
      const pageResponse = await getAllEmployees(
        accessToken,
        currentPage,
        batchSize,
        true,
        username,
      );
      const pageContent: EmployeeRecord[] = pageResponse?.data?.data?.content ?? [];
      allEmployees = allEmployees.concat(pageContent);
    }

    const meterInspectionStaff = allEmployees.filter((employee) => {
      const directRole = employee?.role ?? "";
      const roleFromArray = Array.isArray(employee?.roles)
        ? employee.roles[0] || ""
        : "";
      const normalizedRole = (directRole || roleFromArray).toUpperCase();
      return normalizedRole === "METER_INSPECTION_STAFF";
    });

    const start = page * size;
    const end = start + size;
    const pagedContent = meterInspectionStaff.slice(start, end);
    const totalElements = meterInspectionStaff.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));

    const normalizedContent = pagedContent.map((employee) => ({
      ...employee,
      id: employee.id || employee.userId || "",
    }));

    return NextResponse.json(
      {
        message: "Lấy danh sách nhân viên ghi thu thành công",
        data: {
          content: normalizedContent,
          page: {
            number: page,
            size,
            totalPages,
            totalElements,
          },
          totalPages,
          totalElements,
          number: page,
          size,
        },
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

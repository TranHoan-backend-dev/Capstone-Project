import { NextRequest, NextResponse } from "next/server";
import { createCustomer, getAllCustomers } from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 10);
    const sort = searchParams.get("sort") || "createdAt,desc";

    // Filter params - Lấy tất cả filter từ query params
    const filters: Record<string, any> = {};

    // Lấy các filter từ searchParams
    const filterFields = [
      "name",
      "email",
      "phoneNumber",
      "type",
      "isBigCustomer",
      "usageTarget",
      "numberOfHouseholds",
      "householdRegistrationNumber",
      "protectEnvironmentFee",
      "isFree",
      "isSale",
      "m3Sale",
      "fixRate",
      "installationFee",
      "deductionPeriod",
      "monthlyRent",
      "waterMeterType",
      "citizenIdentificationNumber",
      "citizenIdentificationProvideAt",
      "paymentMethod",
      "bankAccountNumber",
      "bankAccountProviderLocation",
      "bankAccountName",
      "budgetRelationshipCode",
      "passportCode",
      "connectionPoint",
      "isActive",
      "cancelReason",
      "formNumber",
      "formCode",
      "waterPriceId",
      "waterMeterId",
      "roadmapId",
      "address",
      "search",
    ];

    filterFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value !== null && value !== undefined && value !== "") {
        filters[field] = value;
      }
    });

    const response = await getAllCustomers(
      accessToken,
      page,
      size,
      sort,
      filters,
    );

    return NextResponse.json(
      {
        message: "Lấy danh sách khách hàng thành công",
        data: response.data.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching customers:", error);
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

    const body = await req.json();
    const response = await createCustomer(accessToken, body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          error.message ||
          "Internal server error",
        details: error.response?.data,
      },
      { status: error.response?.status || 500 },
    );
  }
}

// app/api/customer/customer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_GATEWAY_URL } from "@/utils/constraints";
import { createCustomer } from "@/services/customer.service";
import { getAccessToken } from "@/utils/getAccessToken";

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
       console.log("Received data:", body);
    const response = await createCustomer(accessToken, body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Error in customer creation API route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${API_GATEWAY_URL}/customer/customer${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch customers" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in fetch customers API route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

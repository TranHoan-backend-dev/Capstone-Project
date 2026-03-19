// app/api/construction/estimates/[estimateId]/route.ts
import {
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

    // Kiểm tra content-type để xử lý formData hay JSON
    const contentType = req.headers.get("content-type") || "";

    let updateRequest: UpdateEstimateRequest = {};

    if (contentType.includes("multipart/form-data")) {
      // Xử lý FormData (có file)
      const formData = await req.formData();

      updateRequest = {
        customerName: formData.get("customerName")?.toString(),
        address: formData.get("address")?.toString(),
        note: formData.get("note")?.toString(),
        contractFee: formData.get("contractFee")
          ? Number(formData.get("contractFee"))
          : undefined,
        surveyFee: formData.get("surveyFee")
          ? Number(formData.get("surveyFee"))
          : undefined,
        surveyEffort: formData.get("surveyEffort")
          ? Number(formData.get("surveyEffort"))
          : undefined,
        installationFee: formData.get("installationFee")
          ? Number(formData.get("installationFee"))
          : undefined,
        laborCoefficient: formData.get("laborCoefficient")
          ? Number(formData.get("laborCoefficient"))
          : undefined,
        generalCostCoefficient: formData.get("generalCostCoefficient")
          ? Number(formData.get("generalCostCoefficient"))
          : undefined,
        precalculatedTaxCoefficient: formData.get("precalculatedTaxCoefficient")
          ? Number(formData.get("precalculatedTaxCoefficient"))
          : undefined,
        constructionMachineryCoefficient: formData.get(
          "constructionMachineryCoefficient",
        )
          ? Number(formData.get("constructionMachineryCoefficient"))
          : undefined,
        vatCoefficient: formData.get("vatCoefficient")
          ? Number(formData.get("vatCoefficient"))
          : undefined,
        designCoefficient: formData.get("designCoefficient")
          ? Number(formData.get("designCoefficient"))
          : undefined,
        designFee: formData.get("designFee")
          ? Number(formData.get("designFee"))
          : undefined,
        waterMeterSerial: formData.get("waterMeterSerial")?.toString(),
        overallWaterMeterId: formData.get("overallWaterMeterId")?.toString(),
        isFinished: formData.get("isFinished") === "true",
      };

      // Xử lý upload file nếu có
      const designImageFile = formData.get("designImage") as File | null;
      if (designImageFile && designImageFile.size > 0) {
        const imageUrl = await uploadImageToStorage(designImageFile);
        updateRequest.designImage = imageUrl;
      }
    } else {
      // Xử lý JSON
      updateRequest = await req.json();
    }

    // Gọi API service
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
  } catch (error: any) {
    console.error("Error updating estimate:", error);
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

// Helper function để upload image
async function uploadImageToStorage(file: File): Promise<string> {
  try {
    // Tạo FormData để upload
    const formData = new FormData();
    formData.append("file", file);

    // Option 1: Upload lên Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      formData.append(
        "upload_preset",
        process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default",
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    }

    // Option 2: Upload lên server của bạn
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

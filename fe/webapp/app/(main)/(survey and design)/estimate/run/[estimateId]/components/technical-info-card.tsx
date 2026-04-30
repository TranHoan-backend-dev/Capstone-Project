"use client";

import React, { useState, useEffect, useRef } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomInput from "@/components/ui/custom/CustomInput";
import {
  DeleteIcon,
  SaveDocumentCheckIcon,
  DocumentMagnifyGlassIcon,
  TitleDarkColor,
  DocumentCheckedIcon,
} from "@/config/chip-and-icon";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomTextarea from "@/components/ui/custom/CustomTextarea";
import { EstimateResponse, MaterialEstimateItem } from "@/types";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import { useIsPlanningTechnicalDepartmentHead } from "@/hooks/useHasRole";
import { calculateTotalAmountRaw } from "@/utils/calculateTotalAmount";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

interface TechnicalInfoCardProps {
  estimateData: EstimateResponse | null;
  setEstimateData: React.Dispatch<
    React.SetStateAction<EstimateResponse | null>
  >;
  estimateId: string;
  materials: MaterialEstimateItem[];
}

interface Parameter {
  id: string;
  name: string;
  value: string;
  creatorName: string;
  updatorName: string;
  createAt: string;
  updateAt: string;
}

const handleNumberInput = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (value === "") {
    setter("");
    return;
  }
  const regex = /^\d*\.?\d*$/;

  if (regex.test(value)) {
    setter(value);
  }
};

export const TechnicalInfoCard = ({
  estimateData,
  setEstimateData,
  estimateId,
  materials,
}: TechnicalInfoCardProps) => {
  const { isPlanningTechnicalDepartmentHead } =
    useIsPlanningTechnicalDepartmentHead();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [contractFee, setContractFee] = useState("");
  const [surveyFee, setSurveyFee] = useState("");
  const [surveyEffort, setSurveyEffort] = useState("1");
  const [installationFee, setInstallationFee] = useState("");
  const [laborCoefficient, setLaborCoefficient] = useState("");
  const [generalCostCoefficient, setGeneralCostCoefficient] = useState("");
  const [precalculatedTaxCoefficient, setPrecalculatedTaxCoefficient] =
    useState("");
  const [
    constructionMachineryCoefficient,
    setConstructionMachineryCoefficient,
  ] = useState("");
  const [vatCoefficient, setVatCoefficient] = useState("");
  const [designCoefficient, setDesignCoefficient] = useState("");
  const [designFee, setDesignFee] = useState("");

  const [designImageFile, setDesignImageFile] = useState<File | null>(null);
  const [designImageUrl, setDesignImageUrl] = useState(""); // tên file gốc từ backend
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Tạo URL proxy để hiển thị ảnh từ backend
  const getImageProxyUrl = (fileName: string) => {
    if (!fileName) return "";
    // Nếu đã là URL đầy đủ thì dùng luôn
    if (fileName.startsWith("http")) return fileName;
    const name = fileName.split("/").pop() || fileName;
    return `/api/construction/estimates/image/${encodeURIComponent(name)}`;
  };

  const [showWaterMeterModal, setShowWaterMeterModal] = useState(false);

  const [showOverallModal, setShowOverallModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [overallWaterMeterId, setOverallWaterMeterId] = useState("");
  const [displayOverallWaterMeter, setDisplayOverallWaterMeter] = useState("");

  const [overallMeters, setOverallMeters] = useState<any[]>([]);

  /** ID loại đồng hồ (meter type), gửi lên API dưới `generalInformation.waterMeterType` */
  const [waterMeterType, setWaterMeterType] = useState("");
  const [waterMeterSerial, setWaterMeterSerial] = useState("");
  const [displayWaterMeter, setDisplayWaterMeter] = useState("");

  const [defaultParameters, setDefaultParameters] = useState<Parameter[]>([]);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEstimateApproved =
    estimateData?.generalInformation?.status?.estimate === "APPROVED";
  const isReadOnly = isEstimateApproved || isPlanningTechnicalDepartmentHead;

  // Validation functions
  const validateRequired = (value: string, fieldName: string) => {
    if (!value || !value.trim()) {
      return `${fieldName} không được để trống`;
    }
    return null;
  };

  const validateSerialNumber = (value: string) => {
    if (!value || !value.trim()) return null; // handled by validateRequired
    const specialCharRegex = /[^a-zA-Z0-9\-_]/;
    if (specialCharRegex.test(value)) {
      return "Số sê-ri đồng hồ không được chứa ký tự đặc biệt";
    }
    return null;
  };

  const validateImage = () => {
    // Check if there's no image and image hasn't been deleted
    if (!designImageUrl && !designImageFile && !isImageDeleted) {
      return "Ảnh cụm đồng hồ là bắt buộc";
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    const customerNameError = validateRequired(customerName, "Tên khách hàng");
    if (customerNameError) newErrors.customerName = customerNameError;

    const waterMeterTypeError = validateRequired(
      waterMeterType,
      "Loại đồng hồ nước",
    );
    if (waterMeterTypeError) newErrors.waterMeterType = waterMeterTypeError;

    const waterMeterSerialError = validateRequired(
      waterMeterSerial,
      "Số sê-ri đồng hồ",
    );
    if (waterMeterSerialError)
      newErrors.waterMeterSerial = waterMeterSerialError;

    const waterMeterSerialSpecialCharError = validateSerialNumber(waterMeterSerial);
    if (waterMeterSerialSpecialCharError)
      newErrors.waterMeterSerial = waterMeterSerialSpecialCharError;

    // Image validation
    const imageError = validateImage();
    if (imageError) newErrors.designImage = imageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleFieldChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    fieldName: string,
    value: string,
  ) => {
    setter(value);
    clearFieldError(fieldName);
  };

  const fetchDefaultParameters = async () => {
    try {
      setIsLoadingDefaults(true);
      const response = await authFetch("/api/device/parameters");
      const result = await response.json();

      if (result.data?.content) {
        setDefaultParameters(result.data.content);

        if (
          !estimateData?.generalInformation ||
          Object.keys(estimateData.generalInformation).length === 0
        ) {
          applyDefaultCoefficients(result.data.content);
        }
      }
    } catch (error) {
      console.error("Failed to fetch default parameters:", error);
    } finally {
      setIsLoadingDefaults(false);
    }
  };

  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const applyDefaultCoefficients = (parameters: Parameter[]) => {
    const laborParam = parameters.find((p) => p.name === "Hệ số nhân công");
    const generalCostParam = parameters.find(
      (p) => p.name === "Hệ số chi phí chung",
    );
    const precalculatedTaxParam = parameters.find(
      (p) => p.name === "Hệ số thuế tính trước",
    );
    const constructionMachineryParam = parameters.find(
      (p) => p.name === "Hệ số máy thi công",
    );
    const vatParam = parameters.find((p) => p.name === "Hệ số thuế GTGT (VAT)");
    const designParam = parameters.find((p) => p.name === "Hệ số thiết kế");
    const contractFeeParam = parameters.find((p) => p.name === "Phí hợp đồng");
    const surveyFeeParam = parameters.find((p) => p.name === "Phí khảo sát");
    const installationFeeParam = parameters.find((p) => p.name === "Phí lắp đặt");
    const designFeeParam = parameters.find((p) => p.name === "Phí thiết kế");
    
    if (laborParam && laborParam.value) {
      setLaborCoefficient(laborParam.value);
    }
    if (generalCostParam && generalCostParam.value) {
      setGeneralCostCoefficient(generalCostParam.value);
    }
    if (precalculatedTaxParam && precalculatedTaxParam.value) {
      setPrecalculatedTaxCoefficient(precalculatedTaxParam.value);
    }
    if (constructionMachineryParam && constructionMachineryParam.value) {
      setConstructionMachineryCoefficient(constructionMachineryParam.value);
    }
    if (vatParam && vatParam.value) {
      setVatCoefficient(vatParam.value);
    }
    if (designParam && designParam.value) {
      setDesignCoefficient(designParam.value);
    }
    if (contractFeeParam && contractFeeParam.value) {
      setContractFee(contractFeeParam.value);
    }
    if (surveyFeeParam && surveyFeeParam.value) {
      setSurveyFee(surveyFeeParam.value);
    }
    if (installationFeeParam && installationFeeParam.value) {
      setInstallationFee(installationFeeParam.value);
    }
    if (designFeeParam && designFeeParam.value) {
      setDesignFee(designFeeParam.value);
    }
  };

  const isNewEstimate = () => {
    return (
      !estimateData?.generalInformation ||
      Object.keys(estimateData.generalInformation).length === 0 ||
      (!estimateData.generalInformation.customerName &&
        !estimateData.generalInformation.address)
    );
  };

  useEffect(() => {
    const fetchOverallMeters = async () => {
      try {
        const res = await authFetch("/api/device/water-meters/overall");
        const json = await res.json();
        if (json.data?.content) {
          setOverallMeters(json.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch overall meters list:", error);
      }
    };

    fetchOverallMeters();
    fetchDefaultParameters();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchWaterMeterTypeLabel = async () => {
      if (!waterMeterType) {
        setDisplayWaterMeter("");
        return;
      }
      try {
        const response = await authFetch(
          `/api/device/water-meter-type/${waterMeterType}`,
        );
        const result = await response.json();
        if (cancelled || !result.data) return;
        const d = result.data;
        setDisplayWaterMeter(
          `Tên: ${d.name} - Nguồn gốc: ${d.origin} - Loại: ${d.meterModel}`,
        );
      } catch (error) {
        console.error("Failed to fetch water meter type:", error);
      }
    };

    fetchWaterMeterTypeLabel();
    return () => {
      cancelled = true;
    };
  }, [waterMeterType]);

  useEffect(() => {
    if (overallWaterMeterId && overallMeters.length > 0) {
      const found = overallMeters.find(
        (item) => item.serial === overallWaterMeterId,
      );

      if (found) {
        setDisplayOverallWaterMeter(found.name);
      }
    }
  }, [overallWaterMeterId, overallMeters]);

  useEffect(() => {
    if (estimateData?.generalInformation) {
      const info = estimateData.generalInformation;
      setCustomerName(info.customerName || "");
      setAddress(info.address || "");
      setNote(info.note || "");
      if (info.contractFee !== undefined && info.contractFee !== null) {
        setContractFee(info.contractFee.toString());
      }
      if (info.surveyFee !== undefined && info.surveyFee !== null) {
        setSurveyFee(info.surveyFee.toString());
      }
      if (info.surveyEffort !== undefined && info.surveyEffort !== null) {
        setSurveyEffort(info.surveyEffort.toString());
      }
      if (info.installationFee !== undefined && info.installationFee !== null) {
        setInstallationFee(info.installationFee.toString());
      }
      if (
        info.laborCoefficient !== undefined &&
        info.laborCoefficient !== null
      ) {
        setLaborCoefficient(info.laborCoefficient.toString());
      } else if (isNewEstimate() && defaultParameters.length > 0) {
      }

      if (
        info.generalCostCoefficient !== undefined &&
        info.generalCostCoefficient !== null
      ) {
        setGeneralCostCoefficient(info.generalCostCoefficient.toString());
      }

      if (
        info.precalculatedTaxCoefficient !== undefined &&
        info.precalculatedTaxCoefficient !== null
      ) {
        setPrecalculatedTaxCoefficient(
          info.precalculatedTaxCoefficient.toString(),
        );
      }

      if (
        info.constructionMachineryCoefficient !== undefined &&
        info.constructionMachineryCoefficient !== null
      ) {
        setConstructionMachineryCoefficient(
          info.constructionMachineryCoefficient.toString(),
        );
      }

      if (info.vatCoefficient !== undefined && info.vatCoefficient !== null) {
        setVatCoefficient(info.vatCoefficient.toString());
      }

      if (
        info.designCoefficient !== undefined &&
        info.designCoefficient !== null
      ) {
        setDesignCoefficient(info.designCoefficient.toString());
      }
      if (info.designFee !== undefined && info.designFee !== null) {
        setDesignFee(info.designFee.toString());
      }
      setWaterMeterType(info.waterMeterType || "");
      setWaterMeterSerial(info.waterMeterSerial || "");
      setOverallWaterMeterId(info.overallWaterMeterId || "");
      setDesignImageUrl(info.designImageUrl || "");
      setIsImageDeleted(false);

      // Clear image error if there's an image
      if (info.designImageUrl) {
        clearFieldError("designImage");
      }
    }
  }, [estimateData, defaultParameters]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async (isFinished: boolean) => {
    if (isReadOnly) return;
    // Validate before saving
    if (!validateForm()) {
      CallToast({
        title: "Thất bại",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        color: "warning",
      });
      return;
    }

    // Check if materials exist
    if (materials.length === 0) {
      CallToast({
        title: "Thất bại",
        message: "Vui lòng thêm ít nhất một vật tư",
        color: "warning",
      });
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();

      // Gửi từng field của generalInformation - KHÔNG gửi dưới dạng JSON string
      formData.append("generalInformation.customerName", customerName || "");
      formData.append("generalInformation.address", address || "");
      formData.append("generalInformation.note", note || "");
      formData.append(
        "generalInformation.contractFee",
        String(contractFee ? Number(contractFee) : 0),
      );
      formData.append(
        "generalInformation.surveyFee",
        String(surveyFee ? Number(surveyFee) : 0),
      );
      formData.append(
        "generalInformation.surveyEffort",
        String(surveyEffort ? Number(surveyEffort) : 0),
      );
      formData.append(
        "generalInformation.installationFee",
        String(installationFee ? Number(installationFee) : 0),
      );
      formData.append(
        "generalInformation.laborCoefficient",
        String(laborCoefficient ? Number(laborCoefficient) : 0),
      );
      formData.append(
        "generalInformation.generalCostCoefficient",
        String(generalCostCoefficient ? Number(generalCostCoefficient) : 0),
      );
      formData.append(
        "generalInformation.precalculatedTaxCoefficient",
        String(
          precalculatedTaxCoefficient ? Number(precalculatedTaxCoefficient) : 0,
        ),
      );
      formData.append(
        "generalInformation.constructionMachineryCoefficient",
        String(
          constructionMachineryCoefficient
            ? Number(constructionMachineryCoefficient)
            : 0,
        ),
      );
      formData.append(
        "generalInformation.vatCoefficient",
        String(vatCoefficient ? Number(vatCoefficient) : 0),
      );
      formData.append(
        "generalInformation.designCoefficient",
        String(designCoefficient ? Number(designCoefficient) : 0),
      );
      formData.append(
        "generalInformation.designFee",
        String(designFee ? Number(designFee) : 0),
      );
      formData.append(
        "generalInformation.waterMeterSerial",
        waterMeterSerial || "",
      );
      formData.append(
        "generalInformation.waterMeterType",
        waterMeterType || "",
      );
      formData.append(
        "generalInformation.overallWaterMeterId",
        overallWaterMeterId || "",
      );

      // Handle image upload - always send if there's a file or keep existing
      if (designImageFile instanceof File) {
        formData.append("generalInformation.designImage", designImageFile);
        console.log("Appending designImage file:", designImageFile.name);
      } else if (isImageDeleted) {
        // If image was deleted, send a flag to remove it
        formData.append("generalInformation.removeImage", "true");
        // Workaround: backend crashes when designImage is null in multipart binding
        formData.append(
          "generalInformation.designImage",
          new Blob([]),
          "empty",
        );
      } else {
        // Workaround: backend crashes when designImage is null in multipart binding
        // Send an empty file part so Spring binds MultipartFile instead of null.
        formData.append(
          "generalInformation.designImage",
          new Blob([]),
          "empty",
        );
      }

      // Gửi materials - mỗi item là một object riêng
      const safeNumber = (v: any) => (isNaN(Number(v)) ? 0 : Number(v));
      materials.forEach((m, index) => {
        const rows = ["material", "materials"];
        rows.forEach((prefix) => {
          formData.append(`${prefix}[${index}].materialCode`, m.id || "");
          formData.append(
            `${prefix}[${index}].jobContent`,
            m.description || "",
          );
          formData.append(`${prefix}[${index}].note`, m.note || "");
          formData.append(`${prefix}[${index}].unit`, m.unit || "");
          formData.append(
            `${prefix}[${index}].mass`,
            String(safeNumber(m.quantity)),
          );
          formData.append(
            `${prefix}[${index}].materialCost`,
            String(safeNumber(m.materialPrice)),
          );
          formData.append(
            `${prefix}[${index}].laborPrice`,
            String(safeNumber(m.laborPrice)),
          );
          formData.append(
            `${prefix}[${index}].totalMaterialPrice`,
            String(m.materialTotal || 0),
          );
          formData.append(
            `${prefix}[${index}].totalLaborPrice`,
            String(m.laborTotal || 0),
          );
        });
      });

      // Tính tổng tiền thô để gửi lên BE
      const rawTotal = calculateTotalAmountRaw(materials, {
        laborCoefficient: Number(laborCoefficient),
        generalCostCoefficient: Number(generalCostCoefficient),
        precalculatedTaxCoefficient: Number(precalculatedTaxCoefficient),
        constructionMachineryCoefficient: Number(constructionMachineryCoefficient),
        vatCoefficient: Number(vatCoefficient),
        designCoefficient: Number(designCoefficient),
        designFee: Number(designFee),
        surveyEffort: Number(surveyEffort),
        surveyFee: Number(surveyFee),
        installationFee: Number(installationFee),
        contractFee: Number(contractFee),
      });
      formData.append("generalInformation.totalAmount", String(rawTotal));

      // Thêm isFinished flag
      formData.append("isFinished", String(isFinished));

      // Gọi API - KHÔNG set Content-Type header
      const res = await authFetch(`/api/construction/estimates/${estimateId}`, {
        method: "PUT",
        body: formData,
      });

      const getErrorMessageFromResponse = (body: any) => {
        const fieldErrors = body?.data ?? body?.error?.data;
        if (fieldErrors && typeof fieldErrors === "object" && !Array.isArray(fieldErrors)) {
          const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
          const EXCLUDED_KEYS = new Set(["timestamp", "status", "path", "error"]);
          const details = Object.entries(fieldErrors)
            .filter(([k, v]) =>
              !EXCLUDED_KEYS.has(k) &&
              typeof v === "string" &&
              v.trim() !== "" &&
              !ISO_DATE_REGEX.test(v),
            )
            .map(([, v]) => v)
            .join("; ");
          if (details) return details;
        }
        return body?.message || body?.error?.message;
      };

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        const text = await res.text();
        json = { message: text };
      }

      if (!res.ok) {
        throw new Error(
          getErrorMessageFromResponse(json) || "Có lỗi xảy ra khi lưu",
        );
      }

      // Cập nhật lại data
      setEstimateData(json.data);

      // Reset file state sau khi upload thành công
      if (designImageFile) {
        setDesignImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      setIsImageDeleted(false);

      CallToast({
        title: "Thành công",
        message: isFinished ? "Hoàn thành dự toán" : "Lưu bản nháp thành công",
        color: "success",
      });
    } catch (error) {
      console.error("Save error:", error);
      CallToast({
        title: "Thất bại",
        message:
          error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu",
        color: "danger",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectWaterMeter = (item: any) => {
    if (isReadOnly) return;
    setWaterMeterType(item.id);
    setDisplayWaterMeter(
      `Tên: ${item.name} - Nguồn gốc: ${item.origin} - Loại: ${item.meterModel}`,
    );
    setShowWaterMeterModal(false);
    clearFieldError("waterMeterType");
    // Re-validate serial nếu đã nhập
    if (waterMeterSerial) {
      clearFieldError("waterMeterSerial");
    }
  };

  const handleSelectOverallMeter = (item: any) => {
    if (isReadOnly) return;
    setOverallWaterMeterId(item.id);
    setDisplayOverallWaterMeter(item.name);
    setShowOverallModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setDesignImageFile(file);
    setIsImageDeleted(false);

    // Tạo preview URL
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(previewUrl);

    // Clear image error when file is selected
    clearFieldError("designImage");
  };

  // Sửa lại handleRemoveImage
  const handleRemoveImage = () => {
    if (isReadOnly) return;
    setDesignImageFile(null);
    setDesignImageUrl("");
    setIsImageDeleted(true);
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Set image error when image is removed
    setErrors((prev) => ({
      ...prev,
      designImage: "Ảnh cụm đồng hồ là bắt buộc",
    }));
  };

  return (
    <>
    <GenericSearchFilter
      actions={
        <div className="pt-6 border-t border-divider">
          {/* Hàng 1: Upload ảnh */}
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleFileChange}
              disabled={isReadOnly}
            />

            <CustomButton
              onPress={() => fileInputRef.current?.click()}
              className="text-white font-bold px-6 shadow-md shadow-success/20"
              color="success"
              startContent={
                isUploading ? undefined : (
                  <DocumentMagnifyGlassIcon className="w-4 h-4" />
                )
              }
              isDisabled={isUploading || isReadOnly}
            >
              {designImageFile ? "Đã chọn ảnh mới" : "Ảnh cụm đồng hồ"}
            </CustomButton>

            {/* Image validation error */}
            {errors.designImage && (
              <p className="text-danger text-tiny mt-2">{errors.designImage}</p>
            )}
          </div>

          {/* Hiển thị trạng thái và preview ảnh */}
          {(designImageUrl || previewImageUrl || designImageFile) &&
            !isImageDeleted && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className="text-sm text-green-600">
                    {designImageFile
                      ? `Đã chọn ảnh mới: ${designImageFile.name}`
                      : designImageUrl &&
                        `Đã có ảnh: ${designImageUrl.split("/").pop()?.slice(0, 30)}...`}
                  </div>
                  <CustomButton
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={handleRemoveImage}
                    className="min-w-unit-8 w-8 h-8"
                    isDisabled={isReadOnly}
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </CustomButton>
                </div>

                {(previewImageUrl || designImageUrl) && (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewImageUrl || getImageProxyUrl(designImageUrl)}
                      alt="Preview ảnh cụm đồng hồ"
                      className="max-w-full max-h-48 object-contain rounded-lg border shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
                      onClick={() =>
                        setLightboxSrc(previewImageUrl || getImageProxyUrl(designImageUrl))
                      }
                      title="Nhấn để phóng to"
                    />
                  </div>
                )}
              </div>
            )}

          {/* Hàng 2: Các nút action */}
          <div className="flex flex-wrap gap-3">
            <CustomButton
              onPress={() => handleSave(false)}
              className="font-bold px-6 shadow-md shadow-primary/20"
              color="primary"
              startContent={
                isUploading ? undefined : (
                  <SaveDocumentCheckIcon className="w-4 h-4" />
                )
              }
              isDisabled={isUploading || isReadOnly}
            >
              {isUploading ? "Đang lưu..." : "Lưu"}
            </CustomButton>

            <CustomButton
              onPress={() => handleSave(true)}
              className="text-white font-bold px-6 shadow-md shadow-success/20"
              color="success"
              startContent={
                isUploading ? undefined : (
                  <DocumentCheckedIcon className="w-4 h-4" />
                )
              }
              isDisabled={isUploading || isReadOnly}
            >
              {isUploading ? "Đang lưu..." : "Gửi"}
            </CustomButton>
          </div>
        </div>
      }
      gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-12"
      icon={<SaveDocumentCheckIcon className="w-6 h-6" />}
      title="Lập hồ sơ kỹ thuật & chi phí vật tư"
    >
      <div className="lg:col-span-1 space-y-4">
        <h3
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Thông tin khách hàng & công trình
        </h3>

        <CustomInput
          isRequired
          label="Tên khách hàng"
          value={customerName}
          onChange={(e) =>
            handleFieldChange(setCustomerName, "customerName", e.target.value)
          }
          isInvalid={!!errors.customerName}
          errorMessage={errors.customerName}
          isDisabled={isReadOnly}
        />

        <CustomInput
          label="Địa chỉ thi công"
          value={address}
          onChange={(e) =>
            handleFieldChange(setAddress, "address", e.target.value)
          }
          isInvalid={!!errors.address}
          errorMessage={errors.address}
          isDisabled={isReadOnly}
        />

        <CustomTextarea
          label="Ghi chú thêm"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          isDisabled={isReadOnly}
        />
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Thông số kỹ thuật lắp đặt
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInput
            label="Phí hợp đồng"
            value={contractFee}
            onChange={(e) => handleNumberInput(e.target.value, setContractFee)}
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Phí khảo sát"
            value={surveyFee}
            onChange={(e) => handleNumberInput(e.target.value, setSurveyFee)}
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Ngày công khảo sát"
            value={surveyEffort}
            onChange={(e) => handleNumberInput(e.target.value, setSurveyEffort)}
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Phí lắp đặt"
            value={installationFee}
            onChange={(e) =>
              handleNumberInput(e.target.value, setInstallationFee)
            }
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Hệ số nhân công (%)"
            value={laborCoefficient}
            onChange={(e) =>
              handleNumberInput(e.target.value, setLaborCoefficient)
            }
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Hệ số chi phí chung (%)"
            value={generalCostCoefficient}
            onChange={(e) =>
              handleNumberInput(e.target.value, setGeneralCostCoefficient)
            }
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Hệ số thuế tính trước (%)"
            value={precalculatedTaxCoefficient}
            onChange={(e) =>
              handleNumberInput(e.target.value, setPrecalculatedTaxCoefficient)
            }
            isDisabled={isReadOnly}
          />

          {/* <CustomInput
            label="Hệ số máy thi công (%)"
            value={constructionMachineryCoefficient}
            onChange={(e) =>
              setConstructionMachineryCoefficient(e.target.value)
            }
            isDisabled={isReadOnly}
          /> */}

          <CustomInput
            label="Hệ số thuế GTGT (VAT) (%)"
            value={vatCoefficient}
            onChange={(e) =>
              handleNumberInput(e.target.value, setVatCoefficient)
            }
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Hệ số thiết kế (%)"
            value={designCoefficient}
            onChange={(e) =>
              handleNumberInput(e.target.value, setDesignCoefficient)
            }
            isDisabled={isReadOnly}
          />

          <CustomInput
            label="Phí thiết kế"
            value={designFee}
            onChange={(e) => handleNumberInput(e.target.value, setDesignFee)}
            isDisabled={isReadOnly}
          />
        </div>
      </div>

      <div className="lg:col-span-3 pt-4 border-t border-divider space-y-2">
        <h3
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Đồng hồ & đơn vị liên quan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <SearchInputWithButton
              label="Loại đồng hồ nước"
              isRequired
              value={displayWaterMeter}
              onValueChange={() => {}}
              onSearch={() => {
                if (isReadOnly) return;
                setShowWaterMeterModal(true);
              }}
              isDisabled={isReadOnly}
            />
            {errors.waterMeterType && (
              <p className="text-danger text-tiny mt-1">
                {errors.waterMeterType}
              </p>
            )}
          </div>
          <CustomInput
            isRequired
            label="Số sê-ri đồng hồ"
            value={waterMeterSerial}
            onChange={(e) => {
              const value = e.target.value;
              // Chỉ cho phép chữ cái, số, dấu gạch ngang và gạch dưới
              const sanitized = value.replace(/[^a-zA-Z0-9\-_]/g, "");
              handleFieldChange(
                setWaterMeterSerial,
                "waterMeterSerial",
                sanitized,
              );
            }}
            onBlur={() => {
              const err = validateSerialNumber(waterMeterSerial);
              if (err) {
                setErrors((prev) => ({ ...prev, waterMeterSerial: err }));
              }
            }}
            isInvalid={!!errors.waterMeterSerial}
            errorMessage={errors.waterMeterSerial}
            isDisabled={isReadOnly}
          />

          <LookupModal
            enableSearch={false}
            dataKey="content"
            isOpen={showWaterMeterModal}
            onClose={() => setShowWaterMeterModal(false)}
            title="Chọn loại đồng hồ nước"
            api="/api/device/water-meter-type"
            columns={[
              { key: "stt", label: "STT" },
              { key: "name", label: "Tên" },
              { key: "origin", label: "Nguồn gốc" },
              { key: "meterModel", label: "Kiểu đồng hồ" },
            ]}
            mapData={(item: any, index: number) => ({
              stt: index + 1,
              id: item.typeId ?? item.id,
              name: item.name,
              origin: item.origin,
              meterModel: item.meterModel,
              indexLength: item.indexLength,
            })}
            onSelect={handleSelectWaterMeter}
          />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <SearchInputWithButton
              label="Đồng hồ nước tổng"
              value={displayOverallWaterMeter}
              onValueChange={() => {}}
              onSearch={() => {
                if (isReadOnly) return;
                setShowOverallModal(true);
              }}
              isDisabled={isReadOnly}
            />
          </div>

          <LookupModal
            dataKey="content"
            isOpen={showOverallModal}
            onClose={() => setShowOverallModal(false)}
            title="Chọn đồng hồ nước tổng"
            api="/api/device/water-meters/overall"
            searchKey="keyword"
            columns={[
              { key: "stt", label: "STT" },
              { key: "name", label: "Tên đồng hồ" },
            ]}
            mapData={(item: any, index: number) => ({
              stt: index + 1,
              id: item.serial,
              name: item.name,
            })}
            onSelect={handleSelectOverallMeter}
          />
        </div>
      </div>
    </GenericSearchFilter>

    {/* Lightbox phóng to ảnh */}
    {lightboxSrc && (
      <ImageLightbox
        src={lightboxSrc}
        alt="Ảnh cụm đồng hồ"
        onClose={() => setLightboxSrc(null)}
      />
    )}
    </>
  );
};

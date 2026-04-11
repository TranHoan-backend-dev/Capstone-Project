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

export const TechnicalInfoCard = ({
  estimateData,
  setEstimateData,
  estimateId,
  materials,
}: TechnicalInfoCardProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [contractFee, setContractFee] = useState("");
  const [surveyFee, setSurveyFee] = useState("");
  const [surveyEffort, setSurveyEffort] = useState("");
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
  const [designImageUrl, setDesignImageUrl] = useState("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);

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

  // Validation functions
  const validateRequired = (value: string, fieldName: string) => {
    if (!value || !value.trim()) {
      return `${fieldName} không được để trống`;
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
      setContractFee(info.contractFee?.toString() || "");
      setSurveyFee(info.surveyFee?.toString() || "");
      setSurveyEffort(info.surveyEffort?.toString() || "");
      setInstallationFee(info.installationFee?.toString() || "");
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

      setDesignFee(info.designFee?.toString() || "");
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
    // Validate before saving
    if (!validateForm()) {
      CallToast({
        title: "Validation Error",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        color: "warning",
      });
      return;
    }

    // Check if materials exist
    if (materials.length === 0) {
      CallToast({
        title: "Validation Error",
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
      }

      // Gửi materials - mỗi item là một object riêng
      const safeNumber = (v: any) => (isNaN(Number(v)) ? 0 : Number(v));
      materials.forEach((m, index) => {
        formData.append(`material[${index}].materialCode`, m.id || "");
        formData.append(`material[${index}].jobContent`, m.description || "");
        formData.append(`material[${index}].note`, m.note || "");
        formData.append(`material[${index}].unit`, m.unit || "");
        formData.append(
          `material[${index}].mass`,
          String(safeNumber(m.quantity)),
        );
        formData.append(
          `material[${index}].materialCost`,
          String(safeNumber(m.materialPrice)),
        );
        formData.append(
          `material[${index}].laborPrice`,
          String(safeNumber(m.laborPrice)),
        );
        formData.append(
          `material[${index}].totalMaterialPrice`,
          String(m.materialTotal || 0),
        );
        formData.append(
          `material[${index}].totalLaborPrice`,
          String(m.laborTotal || 0),
        );
      });

      // Thêm isFinished flag
      formData.append("isFinished", String(isFinished));

      // Gọi API - KHÔNG set Content-Type header
      const res = await authFetch(`/api/construction/estimates/${estimateId}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.error?.message || json?.message || "Có lỗi xảy ra",
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
    setWaterMeterType(item.id);
    setDisplayWaterMeter(
      `Tên: ${item.name} - Nguồn gốc: ${item.origin} - Loại: ${item.meterModel}`,
    );
    setShowWaterMeterModal(false);
    clearFieldError("waterMeterType");
  };

  const handleSelectOverallMeter = (item: any) => {
    setOverallWaterMeterId(item.id);
    setDisplayOverallWaterMeter(item.name);
    setShowOverallModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              isDisabled={isUploading || isEstimateApproved}
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
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </CustomButton>
                </div>

                {/* Preview ảnh */}
                {(previewImageUrl || designImageUrl) && (
                  <div>
                    <img
                      src={previewImageUrl || designImageUrl}
                      alt="Preview ảnh cụm đồng hồ"
                      className="max-w-full md:max-w-xs max-h-48 object-cover rounded-lg border shadow-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {previewImageUrl ? "Ảnh mới (chưa lưu)" : "Ảnh hiện tại"}
                    </p>
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
              isDisabled={isUploading || isEstimateApproved}
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
              isDisabled={isUploading || isEstimateApproved}
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
        />

        <CustomInput
          label="Địa chỉ thi công"
          value={address}
          onChange={(e) =>
            handleFieldChange(setAddress, "address", e.target.value)
          }
          isInvalid={!!errors.address}
          errorMessage={errors.address}
        />

        <CustomTextarea
          label="Ghi chú thêm"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
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
            onChange={(e) => setContractFee(e.target.value)}
          />

          <CustomInput
            label="Phí khảo sát"
            value={surveyFee}
            onChange={(e) => setSurveyFee(e.target.value)}
          />

          <CustomInput
            label="Ngày công khảo sát"
            value={surveyEffort}
            onChange={(e) => setSurveyEffort(e.target.value)}
          />

          <CustomInput
            label="Phí lắp đặt"
            value={installationFee}
            onChange={(e) => setInstallationFee(e.target.value)}
          />

          <CustomInput
            label="Hệ số nhân công (%)"
            value={laborCoefficient}
            onChange={(e) => setLaborCoefficient(e.target.value)}
          />

          <CustomInput
            label="Hệ số chi phí chung (%)"
            value={generalCostCoefficient}
            onChange={(e) => setGeneralCostCoefficient(e.target.value)}
          />

          <CustomInput
            label="Hệ số thuế tính trước (%)"
            value={precalculatedTaxCoefficient}
            onChange={(e) => setPrecalculatedTaxCoefficient(e.target.value)}
          />

          <CustomInput
            label="Hệ số máy thi công (%)"
            value={constructionMachineryCoefficient}
            onChange={(e) =>
              setConstructionMachineryCoefficient(e.target.value)
            }
          />

          <CustomInput
            label="Hệ số thuế GTGT (VAT) (%)"
            value={vatCoefficient}
            onChange={(e) => setVatCoefficient(e.target.value)}
          />

          <CustomInput
            label="Hệ số thiết kế (%)"
            value={designCoefficient}
            onChange={(e) => setDesignCoefficient(e.target.value)}
          />

          <CustomInput
            label="Phí thiết kế"
            value={designFee}
            onChange={(e) => setDesignFee(e.target.value)}
          />
        </div>
      </div>

      <div className="lg:col-span-3 pt-4 border-t border-divider space-y-2">
        <h3
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Đồng hồ & đơn vị liên quan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SearchInputWithButton
              label="Loại đồng hồ nước"
              isRequired
              value={displayWaterMeter}
              onValueChange={() => {}}
              onSearch={() => setShowWaterMeterModal(true)}
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
            onChange={(e) =>
              handleFieldChange(
                setWaterMeterSerial,
                "waterMeterSerial",
                e.target.value,
              )
            }
            isInvalid={!!errors.waterMeterSerial}
            errorMessage={errors.waterMeterSerial}
          />
        </div>

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
          })}
          onSelect={handleSelectWaterMeter}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInputWithButton
            label="Đồng hồ nước tổng"
            value={displayOverallWaterMeter}
            onValueChange={() => {}}
            onSearch={() => setShowOverallModal(true)}
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
    </GenericSearchFilter>
  );
};

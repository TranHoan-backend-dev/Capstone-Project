"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomInput from "@/components/ui/custom/CustomInput";
import {
  DeleteIcon,
  SaveDocumentCheckIcon,
  PictureIcon,
  DocumentMagnifyGlassIcon,
  RestoreIcon,
  SumIcon,
  TitleDarkColor,
} from "@/config/chip-and-icon";
import CustomSelect from "@/components/ui/custom/CustomSelect";
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

export const TechnicalInfoCard = ({
  estimateData,
  setEstimateData,
  estimateId,
  materials,
}: TechnicalInfoCardProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State cho từng field
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
  const [showWaterMeterModal, setShowWaterMeterModal] = useState(false);

  const [showOverallModal, setShowOverallModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [overallWaterMeterId, setOverallWaterMeterId] = useState("");
  const [displayOverallWaterMeter, setDisplayOverallWaterMeter] = useState("");

  const [overallMeters, setOverallMeters] = useState<any[]>([]);

  const [waterMeterSerial, setWaterMeterSerial] = useState("");
  const [displayWaterMeter, setDisplayWaterMeter] = useState("");

  // useEffect(() => {
  //   const fetchOverallWaterMeterDetails = async () => {
  //     if (overallWaterMeterId && !displayOverallWaterMeter) {
  //       try {
  //         const response = await authFetch(
  //           `/api/device/water-meters/overall/${overallWaterMeterId}`,
  //         );
  //         const result = await response.json();
  //         if (result.data) {
  //           setDisplayOverallWaterMeter(
  //             `${result.data.name}`,
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch water meter overall:", error);
  //       }
  //     }
  //   };

  //   fetchOverallWaterMeterDetails();
  // }, [overallWaterMeterId, displayOverallWaterMeter]);
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
  }, []);
  useEffect(() => {
    const fetchWaterMeterDetails = async () => {
      if (waterMeterSerial && !displayWaterMeter) {
        try {
          const response = await authFetch(
            `/api/device/water-meters/${waterMeterSerial}`,
          );
          const result = await response.json();
          if (result.data) {
            setDisplayWaterMeter(
              `Loại: ${result.data.typeName} - Size: ${result.data.size} - Lắp: ${result.data.installationDate}`,
            );
          }
        } catch (error) {
          console.error("Failed to fetch water meter:", error);
        }
      }
    };

    fetchWaterMeterDetails();
  }, [waterMeterSerial, displayWaterMeter]);

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

  // Load dữ liệu từ estimateData vào state
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
      setLaborCoefficient(info.laborCoefficient?.toString() || "");
      setGeneralCostCoefficient(info.generalCostCoefficient?.toString() || "");
      setPrecalculatedTaxCoefficient(
        info.precalculatedTaxCoefficient?.toString() || "",
      );
      setConstructionMachineryCoefficient(
        info.constructionMachineryCoefficient?.toString() || "",
      );
      setVatCoefficient(info.vatCoefficient?.toString() || "");
      setDesignCoefficient(info.designCoefficient?.toString() || "");
      setDesignFee(info.designFee?.toString() || "");
      setWaterMeterSerial(info.waterMeterSerial || "");
      setOverallWaterMeterId(info.overallWaterMeterId || "");
      setDesignImageUrl(info.designImageUrl || "");
    }
  }, [estimateData]);

  // Hàm chuyển đổi file sang base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async (isFinished: boolean) => {
    try {
      setIsUploading(true);

      let designImageBase64 = undefined;
      if (designImageFile instanceof File) {
        designImageBase64 = await fileToBase64(designImageFile);
      }
      const safeNumber = (v: any) => (isNaN(Number(v)) ? 0 : Number(v));
      const materialPayload = materials.map((m) => ({
        materialCode: m.id,
        jobContent: m.description,
        note: m.note,
        unit: m.unit,
        reductionCoefficient: String(safeNumber(m.reductionFactor)),
        mass: String(safeNumber(m.quantity)),
        materialCost: String(safeNumber(m.materialPrice)),
        laborPrice: String(safeNumber(m.laborPrice)),
      }));

      const payload = {
        generalInformation: {
          estimationId: estimateId,
          customerName: customerName || "",
          address: address || "",
          note: note || "",
          contractFee: contractFee ? Number(contractFee) : 0,
          surveyFee: surveyFee ? Number(surveyFee) : 0,
          surveyEffort: surveyEffort ? Number(surveyEffort) : 0,
          installationFee: installationFee ? Number(installationFee) : 0,
          laborCoefficient: laborCoefficient ? Number(laborCoefficient) : 0,
          generalCostCoefficient: generalCostCoefficient
            ? Number(generalCostCoefficient)
            : 0,
          precalculatedTaxCoefficient: precalculatedTaxCoefficient
            ? Number(precalculatedTaxCoefficient)
            : 0,
          constructionMachineryCoefficient: constructionMachineryCoefficient
            ? Number(constructionMachineryCoefficient)
            : 0,
          vatCoefficient: vatCoefficient ? Number(vatCoefficient) : 0,
          designCoefficient: designCoefficient ? Number(designCoefficient) : 0,
          designFee: designFee ? Number(designFee) : 0,
          waterMeterSerial: waterMeterSerial || "",
          overallWaterMeterId: overallWaterMeterId || "",
          designImage: designImageBase64,
        },
        material: materialPayload,
        isFinished: isFinished,
      };

      const res = await fetch(`/api/construction/estimates/${estimateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.error?.message || json?.message || "Có lỗi xảy ra",
        );
      }
      if (!res.ok) {
        CallToast({
          title: "Thất bại",
          message: json?.error?.message || "Lưu thất bại",
          color: "danger",
        });
        return;
      }

      setEstimateData(json.data);

      if (designImageFile) {
        setDesignImageFile(null);
      }

      CallToast({
        title: "Thành công",
        message: isFinished ? "Hoàn thành dự toán" : "Lưu bản nháp thành công",
        color: "success",
      });
    } catch (error) {
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
    setWaterMeterSerial(item.id);
    setDisplayWaterMeter(`Loại: ${item.typeName} - Size: ${item.size}`);
    setShowWaterMeterModal(false);
  };

  const handleSelectOverallMeter = (item: any) => {
    setOverallWaterMeterId(item.id);
    setDisplayOverallWaterMeter(item.name);
    setShowOverallModal(false);
  };

  return (
    <GenericSearchFilter
      actions={
        <div className="flex flex-wrap gap-3 pt-6 border-t border-divider">
          <>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setDesignImageFile(file);
                const previewUrl = URL.createObjectURL(file);
              }}
            />

            <CustomButton
              onPress={() => fileInputRef.current?.click()}
              className="text-white font-bold px-6 shadow-md shadow-success/20"
              color="success"
              startContent={<DocumentMagnifyGlassIcon className="w-4 h-4" />}
              isDisabled={isUploading}
            >
              {designImageFile ? "Đã chọn ảnh mới" : "Ảnh cụm đồng hồ"}
            </CustomButton>

            {designImageUrl && !designImageFile && (
              <div className="text-sm text-green-600">
                Đã có ảnh: {designImageUrl.split("/").pop()?.slice(0, 30)}...
              </div>
            )}

            {designImageFile && (
              <div className="text-sm text-blue-600">
                Đã chọn ảnh mới: {designImageFile.name}
              </div>
            )}
          </>
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
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <CustomInput
          label="Địa chỉ thi công"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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

      <div className="lg:col-span-2 pt-8 border-t border-divider space-y-4">
        <h3
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Đồng hồ & đơn vị liên quan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInputWithButton
            label="Đồng hồ nước"
            isRequired
            value={displayWaterMeter}
            onValueChange={() => {}}
            onSearch={() => setShowWaterMeterModal(true)}
          />
          <LookupModal
            enableSearch={false}
            dataKey="content"
            isOpen={showWaterMeterModal}
            onClose={() => setShowWaterMeterModal(false)}
            title="Chọn đồng hồ nước"
            api="/api/device/water-meters"
            columns={[
              { key: "stt", label: "STT" },
              { key: "typeName", label: "Loại đồng hồ" },
              { key: "size", label: "Cỡ đồng hồ" },
              { key: "installationDate", label: "Ngày lắp đặt" },
            ]}
            mapData={(item: any, index: number) => ({
              stt: index + 1,
              id: item.id,
              typeName: item.typeName,
              size: item.size,
              installationDate: item.installationDate,
            })}
            onSelect={handleSelectWaterMeter}
          />

          <SearchInputWithButton
            label="Đồng hồ nước tổng"
            value={displayOverallWaterMeter}
            onValueChange={() => {}}
            onSearch={() => setShowOverallModal(true)}
          />
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

        {/* Buttons Save */}
        <div className="flex flex-wrap gap-3 pt-4">
          <CustomButton
            onPress={() => handleSave(false)}
            className="font-bold px-6 shadow-md shadow-primary/20"
            color="primary"
            startContent={<SaveDocumentCheckIcon className="w-4 h-4" />}
            isDisabled={isUploading}
          >
            {isUploading ? "Đang lưu..." : "Lưu bản nháp"}
          </CustomButton>
          <CustomButton
            onPress={() => handleSave(true)}
            className="text-white font-bold px-6 shadow-md shadow-success/20"
            color="success"
            isDisabled={isUploading}
          >
            {isUploading ? "Đang lưu..." : "Hoàn thành"}
          </CustomButton>
        </div>
      </div>
    </GenericSearchFilter>
  );
};

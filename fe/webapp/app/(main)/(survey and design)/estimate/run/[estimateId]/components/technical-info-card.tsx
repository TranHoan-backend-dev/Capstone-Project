"use client";

import React, { useState, useEffect } from "react";
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
import { EstimateResponse } from "@/types";

interface TechnicalInfoCardProps {
  estimateData: EstimateResponse | null;
  setEstimateData: React.Dispatch<
    React.SetStateAction<EstimateResponse | null>
  >;
  estimateId: string;
}

export const TechnicalInfoCard = ({
  estimateData,
  setEstimateData,
  estimateId,
}: TechnicalInfoCardProps) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Tạo state riêng cho từng field
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
  const [waterMeterSerial, setWaterMeterSerial] = useState("");
  const [overallWaterMeterId, setOverallWaterMeterId] = useState("");
  const [designImage, setDesignImage] = useState<File | null>(null);

  const [representatives, setRepresentatives] = React.useState([
    { id: 1, name: "", position: "giam-doc" },
  ]);

  const positionOptions = [
    { label: "Giám đốc", key: "head_company" },
    { label: "Trưởng phòng", key: "head" },
  ];

  // Load dữ liệu từ estimateData vào state
  useEffect(() => {
    if (estimateData) {
      setCustomerName(estimateData.customerName || "");
      setAddress(estimateData.address || "");
      setNote(estimateData.note || "");
      setContractFee(estimateData.contractFee?.toString() || "");
      setSurveyFee(estimateData.surveyFee?.toString() || "");
      setSurveyEffort(estimateData.surveyEffort?.toString() || "");
      setInstallationFee(estimateData.installationFee?.toString() || "");
      setLaborCoefficient(estimateData.laborCoefficient?.toString() || "");
      setGeneralCostCoefficient(
        estimateData.generalCostCoefficient?.toString() || "",
      );
      setPrecalculatedTaxCoefficient(
        estimateData.precalculatedTaxCoefficient?.toString() || "",
      );
      setConstructionMachineryCoefficient(
        estimateData.constructionMachineryCoefficient?.toString() || "",
      );
      setVatCoefficient(estimateData.vatCoefficient?.toString() || "");
      setDesignCoefficient(estimateData.designCoefficient?.toString() || "");
      setDesignFee(estimateData.designFee?.toString() || "");
      setWaterMeterSerial(estimateData.waterMeterSerial || "");
      setOverallWaterMeterId(estimateData.overallWaterMeterId || "");
      // designImage là string URL từ API, không phải File
    }
  }, [estimateData]);

  const addRepresentative = () => {
    setRepresentatives([
      ...representatives,
      { id: Date.now(), name: "", position: "giam-doc" },
    ]);
  };

  const removeRepresentative = (id: number) => {
    if (representatives.length > 1) {
      setRepresentatives(representatives.filter((rep) => rep.id !== id));
    }
  };

  const handleSave = async (isFinished: boolean) => {
    const formData = new FormData();

    // Append từng field cụ thể vào FormData từ state
    formData.append("customerName", customerName);
    formData.append("address", address);
    formData.append("note", note);
    formData.append("contractFee", contractFee || "0");
    formData.append("surveyFee", surveyFee || "0");
    formData.append("surveyEffort", surveyEffort || "0");
    formData.append("installationFee", installationFee || "0");
    formData.append("laborCoefficient", laborCoefficient || "0");
    formData.append("generalCostCoefficient", generalCostCoefficient || "0");
    formData.append(
      "precalculatedTaxCoefficient",
      precalculatedTaxCoefficient || "0",
    );
    formData.append(
      "constructionMachineryCoefficient",
      constructionMachineryCoefficient || "0",
    );
    formData.append("vatCoefficient", vatCoefficient || "0");
    formData.append("designCoefficient", designCoefficient || "0");
    formData.append("designFee", designFee || "0");
    formData.append("waterMeterSerial", waterMeterSerial);
    formData.append("overallWaterMeterId", overallWaterMeterId);

    // Xử lý file riêng
    if (designImage instanceof File) {
      formData.append("designImage", designImage);
    }

    formData.append("isFinished", String(isFinished));

    const res = await fetch(`/api/construction/estimates/${estimateId}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Update failed", err);
      return;
    }

    const json = await res.json();
    console.log("Updated estimate", json.data);

    // Cập nhật estimateData với dữ liệu mới từ API
    setEstimateData(json.data);

    alert(isFinished ? "Hoàn thành dự toán" : "Lưu bản nháp thành công");
  };

  return (
    <GenericSearchFilter
      actions={
        <div className="flex flex-wrap gap-3 pt-6 border-t border-divider">
          <CustomButton
            onPress={() => handleSave(false)}
            className="font-bold px-6 shadow-md shadow-primary/20"
            color="primary"
            startContent={<SaveDocumentCheckIcon className="w-4 h-4" />}
          >
            Lưu bản nháp
          </CustomButton>
          <CustomButton
            onPress={() => handleSave(true)}
            className="text-white font-bold px-6 shadow-md shadow-success/20"
            color="success"
          >
            Hoàn thành
          </CustomButton>
          <CustomButton
            className="bg-background dark:bg-default-100 font-bold px-6"
            startContent={<PictureIcon className="w-4 h-4" />}
            variant="bordered"
          >
            Xem hồ sơ
          </CustomButton>
          <>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setDesignImage(file);
              }}
            />

            <CustomButton
              onPress={() => fileInputRef.current?.click()}
              className="text-white font-bold px-6 shadow-md shadow-success/20"
              color="success"
              startContent={<DocumentMagnifyGlassIcon className="w-4 h-4" />}
            >
              Ảnh cụm đồng hồ
            </CustomButton>
          </>
        </div>
      }
      gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-12"
      icon={<SaveDocumentCheckIcon className="w-6 h-6" />}
      title="Lập hồ sơ kỹ thuật & chi phí vật tư"
    >
      {/* Thông tin khách hàng & công trình */}
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

      {/* Thông số kỹ thuật lắp đặt */}
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

      {/* Đồng hồ & đơn vị liên quan */}
      <div className="lg:col-span-2 pt-8 border-t border-divider space-y-4">
        <h3
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Đồng hồ & đơn vị liên quan
        </h3>

        {/* Meter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <CustomInput
            label="Số sê-ri đồng hồ nước"
            value={waterMeterSerial}
            onChange={(e) => setWaterMeterSerial(e.target.value)}
          />

          <CustomInput
            label="ID đồng hồ nước tổng"
            value={overallWaterMeterId}
            onChange={(e) => setOverallWaterMeterId(e.target.value)}
          />
        </div>
      </div>
    </GenericSearchFilter>
  );
};

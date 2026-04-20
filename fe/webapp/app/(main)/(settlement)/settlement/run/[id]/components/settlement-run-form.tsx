"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Textarea,
  Divider,
} from "@heroui/react";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import { SettlementMaterialCard } from "./settlement-material-card";
import { SettlementTotalCost } from "./settlement-total-cost";
import { MaterialEstimateItem, SettlementResponse } from "@/types";

interface SettlementRunFormProps {
  id: string;
}

export const SettlementRunForm = ({ id }: SettlementRunFormProps) => {
  const router = useRouter();
  const isCreateMode = id === "new";

  const [showFormModal, setShowFormModal] = useState(false);
  const [materials, setMaterials] = useState<MaterialEstimateItem[]>([]);
  const [settlementData, setSettlementData] =
    useState<SettlementResponse | null>(null);
  const [estimateData, setEstimateData] = useState<any | null>(null);
  const [form, setForm] = useState({
    settlementId: "",
    formCode: "",
    formNumber: "",
    customerName: "",
    jobContent: "",
    address: "",
    connectionFee: "",
    note: "",
    registrationAt: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!isCreateMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastCode, setLastCode] = useState("");
  const [isFetchingCode, setIsFetchingCode] = useState(true);

  useEffect(() => {
    if (isCreateMode) {
      getLastCode();
    }
  }, []);

  useEffect(() => {
    if (!isCreateMode) {
      const fetchSettlement = async () => {
        try {
          const res = await authFetch(`/api/construction/settlements/${id}`, {
            cache: "no-store",
          });
          if (!res.ok) throw new Error("Không thể tải thông tin quyết toán");
          const json = await res.json();
          const data = json?.data?.data ?? json?.data;
          setSettlementData(data);
          const dataSource = data?.generalInformation ?? data;

          setForm({
            settlementId: dataSource.settlementId ?? dataSource.id ?? "",
            formCode: dataSource.formCode ?? "",
            formNumber: dataSource.formNumber ?? "",
            customerName: dataSource.customerName ?? "",
            jobContent: dataSource.jobContent || "",
            address: dataSource.address || "",
            connectionFee:
              dataSource.connectionFee === null ||
              dataSource.connectionFee === undefined
                ? ""
                : String(dataSource.connectionFee),
            note: dataSource.note ?? "",
            registrationAt: (
              dataSource.registrationAt ?? new Date().toISOString()
            ).split("T")[0],
          });

          if (dataSource.formCode) {
            const estRes = await authFetch(
              `/api/construction/estimates/${dataSource.formCode}`,
            );
            if (estRes.ok) {
              const estJson = await estRes.json();
              setEstimateData(estJson.data);
            }
          }
        } catch (e: any) {
          CallToast({
            title: "Lỗi",
            message: e?.message || "Không thể tải thông tin quyết toán",
            color: "danger",
          });
        } finally {
          setInitialLoading(false);
        }
      };
      fetchSettlement();
    }
  }, [id, isCreateMode]);

  const fetchEstimateData = async (formCode: string) => {
    try {
      const res = await authFetch(`/api/construction/estimates/${formCode}`);
      if (!res.ok) {
        return;
      }
      const json = await res.json();
      setEstimateData(json.data);
      const estGeneralInfo = json.data?.generalInformation ?? json.data;
      if (estGeneralInfo) {
        setForm((prev) => ({
          ...prev,
          customerName: estGeneralInfo.customerName ?? prev.customerName,
          address: estGeneralInfo.address ?? prev.address,
          connectionFee:
            estGeneralInfo.contractFee !== undefined &&
            estGeneralInfo.contractFee !== null
              ? String(estGeneralInfo.contractFee)
              : prev.connectionFee,
          jobContent: estGeneralInfo.jobContent ?? prev.jobContent,
        }));
      }
    } catch (e) {
      console.error("Failed to fetch estimate data:", e);
    }
  };

  const getLastCode = async () => {
    try {
      setIsFetchingCode(true);
      const res = await authFetch("/api/construction/settlements/latest");
      if (!res.ok) {
        throw new Error("Failed to fetch last code");
      }
      const json = await res.json();
      const lastCodeData: string = json.data;

      setLastCode(lastCodeData);

      if (lastCodeData) {
        const numericPart = lastCodeData.replace(/\D/g, "");
        const prefix = lastCodeData.replace(/\d+$/, "");
        const nextNumber = (parseInt(numericPart || "0") + 1)
          .toString()
          .padStart(numericPart.length || 1, "0");
        updateField("settlementId", prefix + nextNumber);
      }
    } catch (error) {
      console.error("Error fetching last code:", error);
      CallToast({
        title: "Lỗi",
        message: "Không thể lấy mã phiếu cuối cùng. Vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsFetchingCode(false);
    }
  };

  const updateField = (field: keyof any, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.formNumber) {
      newErrors.formNumber = "Vui lòng chọn số đơn";
    }

    if (!form.settlementId.trim()) {
      newErrors.settlementId = "Vui lòng nhập mã quyết toán";
    }

    if (!form.customerName.trim()) {
      newErrors.customerName = "Vui lòng nhập tên khách hàng";
    }

    if (!form.jobContent.trim()) {
      newErrors.jobContent = "Vui lòng nhập nội dung công việc";
    }

    if (!form.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    if (!form.connectionFee) {
      newErrors.connectionFee = "Vui lòng nhập chi phí đấu nối";
    } else if (isNaN(Number(form.connectionFee))) {
      newErrors.connectionFee = "Chi phí đấu nối phải là số";
    }

    if (!form.registrationAt) {
      newErrors.registrationAt = "Vui lòng chọn ngày đăng ký";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getErrorMessage = (errorData: any, fallback: string) => {
    const fieldErrors = errorData?.error?.data ?? errorData?.data;
    if (fieldErrors && typeof fieldErrors === "object") {
      const details = Object.values(fieldErrors)
        .filter((value) => typeof value === "string" && value.trim() !== "")
        .join("; ");
      if (details) return details;
    }
    return errorData?.message || errorData?.error?.message || fallback;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      CallToast({
        title: "Lỗi",
        message: "Vui lòng kiểm tra lại thông tin trên form",
        color: "danger",
      });
      return;
    }

    try {
      setLoading(true);

      let payload: any = {
        settlementId: form.settlementId.trim(),
        formCode: form.formCode,
        formNumber: form.formNumber,
        customerName: form.customerName.trim(),
        jobContent: form.jobContent,
        address: form.address,
        connectionFee: Number(form.connectionFee),
        registrationAt: form.registrationAt + "T00:00:00",
        note: form.note,
      };

      if (!isCreateMode) {
        const mappedMaterials = materials.map((m) => ({
          materialCode: m.code,
          jobContent: m.description,
          unit: m.unit,
          mass: m.quantity,
          materialCost: m.materialPrice,
          laborPrice: m.laborPrice,
          totalMaterialPrice: m.materialTotal,
          totalLaborPrice: m.laborTotal,
          note: m.note,
        }));

        const materialCost = materials.reduce(
          (sum, item) => sum + (item.materialTotal || 0),
          0,
        );
        const laborCoefficient = estimateData?.generalInformation
          ?.laborCoefficient
          ? estimateData.generalInformation.laborCoefficient / 100
          : 0;
        const laborCost =
          materials.reduce((sum, item) => sum + (item.laborTotal || 0), 0) *
          (1 + laborCoefficient);
        const directTotal = materialCost + laborCost;

        const generalCostCoefficient = estimateData?.generalInformation
          ?.generalCostCoefficient
          ? estimateData.generalInformation.generalCostCoefficient / 100
          : 0;
        const generalCost = directTotal * generalCostCoefficient;

        const precalculatedTaxCoefficient = estimateData?.generalInformation
          ?.precalculatedTaxCoefficient
          ? estimateData.generalInformation.precalculatedTaxCoefficient / 100
          : 0;
        const preTaxIncome =
          (directTotal + generalCost) * precalculatedTaxCoefficient;

        const constructionCostBeforeTax =
          directTotal + generalCost + preTaxIncome;
        const vatCoefficient = estimateData?.generalInformation?.vatCoefficient
          ? estimateData.generalInformation.vatCoefficient / 100
          : 0;
        const vat = constructionCostBeforeTax * vatCoefficient;
        const constructionCostAfterTax = constructionCostBeforeTax + vat;

        const designAndEstimate =
          (estimateData?.generalInformation?.designFee || 0) *
          (1 +
            (estimateData?.generalInformation?.designCoefficient || 0) / 100);
        const surveyLaborCost =
          (estimateData?.generalInformation?.surveyEffort || 0) *
          (estimateData?.generalInformation?.surveyFee || 0);
        const installationCost =
          estimateData?.generalInformation?.installationFee || 0;
        const consultingTotal =
          designAndEstimate + surveyLaborCost + installationCost;

        const printingCost = estimateData?.generalInformation?.contractFee || 0;
        const otherTotal = printingCost;

        const grandTotal =
          constructionCostAfterTax + consultingTotal + otherTotal;
        const totalAmount = Math.round(grandTotal / 100) * 100;

        payload = {
          ...payload,
          materials: mappedMaterials,
          totalAmount: totalAmount,
        };
      }

      const url = isCreateMode
        ? "/api/construction/settlements"
        : `/api/construction/settlements/${id}`;

      const method = isCreateMode ? "POST" : "PUT";

      const res = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = getErrorMessage(
          errorData,
          isCreateMode ? "Tạo thất bại" : "Cập nhật thất bại",
        );
        throw new Error(errorMessage);
      }

      CallToast({
        title: "Thành công",
        message: isCreateMode
          ? "Tạo quyết toán thành công"
          : "Cập nhật quyết toán thành công",
        color: "success",
      });

      if (isCreateMode && payload.settlementId) {
        router.push(`/settlement/run/${payload.settlementId}`);
      } else {
        router.push("/settlement-lookup");
      }
    } catch (err: any) {
      CallToast({
        title: "Lỗi",
        message:
          err.message ||
          (isCreateMode
            ? "Tạo quyết toán thất bại"
            : "Cập nhật quyết toán thất bại"),
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <p>Đang tải thông tin quyết toán...</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-1 items-start px-6 pt-6">
          <h2 className="text-xl font-semibold">
            {isCreateMode ? "Tạo quyết toán công trình" : "Cập nhật quyết toán"}
          </h2>
          <p className="text-sm text-gray-500">
            Vui lòng điền đầy đủ các thông tin cần thiết để{" "}
            {isCreateMode ? "tạo mới" : "cập nhật"} quyết toán.
          </p>
        </CardHeader>

        <Divider />

        <CardBody className="gap-6 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Mã quyết toán"
              value={form.settlementId}
              onChange={(e) => handleChange("settlementId", e.target.value)}
              isRequired
              isInvalid={!!errors.settlementId}
              errorMessage={errors.settlementId}
              variant="bordered"
              isDisabled={!isCreateMode}
            />

            <SearchInputWithButton
              label="Số đơn"
              value={form.formNumber}
              onSearch={() => setShowFormModal(true)}
              onChange={(e) => {
                handleChange("formNumber", e.target.value);
                if (!e.target.value) {
                  handleChange("formCode", "");
                  handleChange("customerName", "");
                  handleChange("address", "");
                  handleChange("jobContent", "");
                }
              }}
              isInvalid={!!errors.formNumber}
              errorMessage={errors.formNumber}
              required
              isDisabled={!isCreateMode}
            />

            <CustomInput
              label="Tên khách hàng"
              value={form.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              isRequired
              isInvalid={!!errors.customerName}
              errorMessage={errors.customerName}
              variant="bordered"
              isDisabled={!form.formNumber}
            />

            <CustomInput
              label="Nội dung công việc"
              value={form.jobContent}
              onChange={(e) => handleChange("jobContent", e.target.value)}
              isRequired
              isInvalid={!!errors.jobContent}
              errorMessage={errors.jobContent}
              variant="bordered"
              isDisabled={!form.formNumber}
            />

            <CustomInput
              label="Địa chỉ lắp đặt"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              isRequired
              isInvalid={!!errors.address}
              errorMessage={errors.address}
              variant="bordered"
              isDisabled={!form.formNumber}
            />

            <CustomInput
              label="Chi phí đấu nối"
              value={form.connectionFee}
              onChange={(e) => handleChange("connectionFee", e.target.value)}
              isRequired
              isInvalid={!!errors.connectionFee}
              errorMessage={errors.connectionFee}
              variant="bordered"
            />

            <CustomInput
              type="date"
              label="Ngày đăng ký"
              value={form.registrationAt}
              onChange={(e) => handleChange("registrationAt", e.target.value)}
              isRequired
              isInvalid={!!errors.registrationAt}
              errorMessage={errors.registrationAt}
              variant="bordered"
            />
          </div>

          <Textarea
            label="Ghi chú"
            placeholder="Nhập ghi chú (nếu có)"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
            variant="bordered"
            rows={3}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="light"
              onPress={() => router.push("/settlement-lookup")}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
              {isCreateMode ? "Tạo mới" : "Cập nhật"}
            </Button>
          </div>

          <LookupModal
            dataKey="content"
            enableSearch={false}
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            title="Chọn đơn lắp đặt"
            api="/api/construction/installation-forms"
            columns={[
              { key: "stt", label: "STT" },
              { key: "formNumber", label: "Số đơn" },
              { key: "customerName", label: "Tên khách hàng" },
              { key: "address", label: "Địa chỉ" },
            ]}
            mapData={(item, index, page) => ({
              stt: (page - 1) * 10 + index + 1,
              id: item.formCode,
              formNumber: item.formNumber,
              customerName: item.customerName,
              address: item.address,
              jobContent: item.jobContent,
            })}
            onSelect={(item) => {
              handleChange("formCode", item.id);
              handleChange("formNumber", item.formNumber);
              handleChange("customerName", item.customerName ?? "");
              handleChange("address", item.address ?? "");
              if (item.jobContent) {
                handleChange("jobContent", item.jobContent);
              }
              setShowFormModal(false);
              fetchEstimateData(item.id);
            }}
          />
        </CardBody>
      </Card>

      {!isCreateMode && (
        <>
          <SettlementMaterialCard
            settlementId={id}
            settlementData={settlementData}
            materials={materials}
            setMaterials={setMaterials}
          />
          <SettlementTotalCost
            estimateData={estimateData}
            materials={materials}
          />
        </>
      )}
    </div>
  );
};

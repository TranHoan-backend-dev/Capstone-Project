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
  Chip,
} from "@heroui/react";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import { SettlementMaterialCard } from "./settlement-material-card";
import { SettlementTotalCost } from "./settlement-total-cost";
import { MaterialEstimateItem, SettlementResponse } from "@/types";
import { validateCodeField } from "@/utils/validation";

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
              `/api/construction/estimates/form-code/${encodeURIComponent(dataSource.formCode)}`,
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
      const res = await authFetch(
        `/api/construction/estimates/form-code/${encodeURIComponent(formCode)}`,
      );
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
          // Dùng totalAmount từ estimate làm chi phí đấu nối
          connectionFee:
            estGeneralInfo.totalAmount !== undefined &&
            estGeneralInfo.totalAmount !== null
              ? String(estGeneralInfo.totalAmount)
              : prev.connectionFee,
          jobContent: estGeneralInfo.jobContent ?? prev.jobContent,
        }));
      }

      // Load materials từ estimate vào bảng vật tư
      const estimateMaterials = json.data?.materials;
      if (Array.isArray(estimateMaterials) && estimateMaterials.length > 0) {
        const mapped = estimateMaterials.map((item: any, index: number) => {
          const quantity = parseFloat(item.mass) || 0;
          const materialPrice = parseFloat(item.materialCost) || 0;
          const laborPrice = parseFloat(item.laborPrice) || 0;
          return {
            id: item.materialCode || `mat-${index}`,
            code: item.materialCode,
            description: item.jobContent,
            unit: item.unit,
            quantity,
            materialPrice,
            laborPrice,
            materialTotal: quantity * materialPrice,
            laborTotal: laborPrice,
            note: item.note || "",
            stt: index + 1,
          };
        });
        setMaterials(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch estimate data:", e);
    }
  };

  const getLastCode = async () => {
    try {
      const res = await authFetch("/api/construction/settlements/latest");
      if (!res.ok) {
        throw new Error("Failed to fetch last code");
      }
      const json = await res.json();
      const lastCodeData: string = json.data;

      if (lastCodeData) {
        updateField("settlementId", lastCodeData);
      }
    } catch (error) {
      console.error("Error fetching last code:", error);
      CallToast({
        title: "Lỗi",
        message: "Không thể lấy mã phiếu cuối cùng. Vui lòng thử lại sau.",
        color: "danger",
      });
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
    } else {
      const formNumberError = validateCodeField(form.formNumber, "Số đơn");
      if (formNumberError) newErrors.formNumber = formNumberError;
    }

    if (!form.settlementId.trim()) {
      newErrors.settlementId = "Vui lòng nhập mã quyết toán";
    } else {
      const settlementIdError = validateCodeField(
        form.settlementId,
        "Mã quyết toán",
      );
      if (settlementIdError) newErrors.settlementId = settlementIdError;
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

      let payload: any;

      if (isCreateMode) {
        payload = {
          settlementId: form.settlementId.trim(),
          formCode: form.formCode,
          formNumber: form.formNumber,
          customerName: form.customerName.trim(),
          jobContent: form.jobContent,
          address: form.address,
          connectionFee: Number(form.connectionFee),
          registrationAt: form.registrationAt,
          note: form.note,
        };
      } else {
        const mappedMaterials = materials.map((m) => ({
          materialCode: m.code,
          jobContent: m.description,
          note: m.note ?? "",
          unit: m.unit,
          mass: String(m.quantity),
          materialCost: String(m.materialPrice),
          laborPrice: String(m.laborPrice),
          laborPriceAtRuralCommune: "0",
          totalMaterialPrice: String(m.materialTotal),
          totalLaborPrice: String(m.laborTotal),
        }));

        const materialCost = materials.reduce(
          (sum, item) => sum + (item.materialTotal || 0),
          0,
        );
        const laborCoefficient =
          (estimateData?.generalInformation?.laborCoefficient || 0) / 100;
        const laborCost =
          materials.reduce((sum, item) => sum + (item.laborTotal || 0), 0) *
          (1 + laborCoefficient);
        const directTotal = materialCost + laborCost;
        const generalCost =
          directTotal *
          ((estimateData?.generalInformation?.generalCostCoefficient || 0) /
            100);
        const preTaxIncome =
          (directTotal + generalCost) *
          ((estimateData?.generalInformation?.precalculatedTaxCoefficient ||
            0) /
            100);
        const constructionCostBeforeTax =
          directTotal + generalCost + preTaxIncome;
        const vat =
          constructionCostBeforeTax *
          ((estimateData?.generalInformation?.vatCoefficient || 0) / 100);
        const constructionCostAfterTax = constructionCostBeforeTax + vat;
        const designAndEstimate =
          (estimateData?.generalInformation?.designFee || 0) *
          (1 +
            (estimateData?.generalInformation?.designCoefficient || 0) / 100);
        const surveyLaborCost =
          (estimateData?.generalInformation?.surveyEffort || 0) *
          (estimateData?.generalInformation?.surveyFee || 0);
        const consultingTotal =
          designAndEstimate +
          surveyLaborCost +
          (estimateData?.generalInformation?.installationFee || 0);
        const otherTotal = estimateData?.generalInformation?.contractFee || 0;
        const totalAmount =
          Math.round(
            (constructionCostAfterTax + consultingTotal + otherTotal) / 100,
          ) * 100;

        payload = {
          settlementId: form.settlementId.trim(),
          jobContent: form.jobContent,
          connectionFee: Number(form.connectionFee),
          note: form.note,
          materials: mappedMaterials,
          totalAmount,
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
              isDisabled
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
              isDisabled
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
              { key: "contractStatus", label: "Hợp đồng" },
            ]}
            mapData={(item, index, page) => ({
              stt: (page - 1) * 10 + index + 1,
              id: item.formCode ?? item.id ?? "",
              formNumber: item.formNumber,
              customerName: item.customerName,
              address: item.address,
              jobContent: item.jobContent,

              contractStatus: (
                <Chip
                  color={
                    item.status?.contract === "APPROVED" ? "success" : "warning"
                  }
                  variant="flat"
                >
                  {item.status?.contract === "APPROVED"
                    ? "Đã duyệt"
                    : "Chưa duyệt"}
                </Chip>
              ),

              _contractApproved: item.status?.contract === "APPROVED",
            })}
            isRowDisabled={(item: any) => !item._contractApproved}
            disabledRowTooltip="Hợp đồng chưa được duyệt, không thể tạo quyết toán"
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

      {(isCreateMode ? !!form.formNumber : true) && (
        <>
          <SettlementMaterialCard
            settlementId={id}
            settlementData={isCreateMode ? null : settlementData}
            materials={materials}
            setMaterials={setMaterials}
          />
          <SettlementTotalCost
            estimateData={estimateData}
            materials={materials}
            onTotalChange={(total) => handleChange("connectionFee", String(total))}
          />
        </>
      )}
    </div>
  );
};

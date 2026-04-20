"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Textarea,
  Divider,
  Tooltip,
} from "@heroui/react";
import {
  PlusIcon,
  TrashIcon,
  UserIcon,
  DocumentIcon,
  HomeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import { CreateContractRequest, Appendix, Representative } from "@/types";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { SaveDocumentCheckIcon } from "@/config/chip-and-icon";
import { RefreshIcon } from "@/components/ui/Icons";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";

interface ContractFormProps {
  onSuccess?: () => void;
}

interface InstallationForm {
  formCode: string;
  formNumber: string;
  customerId: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  email?: string;
  citizenIdentificationNumber?: string;
  overallWaterMeterId?: string;
  representatives?: Array<{ name: string; position: string | null }>;
}

export const ContractForm = ({ onSuccess }: ContractFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<InstallationForm | null>(
    null,
  );

  const [formData, setFormData] = useState<Partial<CreateContractRequest>>({
    contractId: "",
    formCode: "",
    formNumber: "",
    customerId: "",
    representatives: [] as Representative[],
    appendix: [] as Appendix[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLastCode = async () => {
      try {
        const res = await authFetch("/api/customer/contracts/latest");
        if (!res.ok) return;
        const json = await res.json();
        const lastCode: string = json.data;
        if (lastCode) {
          const numericPart = lastCode.replace(/\D/g, "");
          const prefix = lastCode.replace(/\d+$/, "");
          const nextNumber = (parseInt(numericPart || "0") + 1)
            .toString()
            .padStart(numericPart.length || 1, "0");
          setFormData((prev) => ({ ...prev, contractId: prefix + nextNumber }));
        }
      } catch (e) {
        console.error("Failed to fetch last contract code:", e);
      }
    };
    fetchLastCode();
  }, []);

  const handleSelectForm = (selected: any) => {
    setSelectedForm(selected);
    setFormData((prev) => ({
      ...prev,
      formCode: selected.formCode,
      formNumber: selected.formNumber,
      customerId: selected.customerId,
      representatives:
        selected.representatives && selected.representatives.length > 0
          ? selected.representatives.map((rep: any) => ({
              name: rep.name || "",
              position: rep.position || "Chủ công trình",
            }))
          : selected.customerName
            ? [
                {
                  name: selected.customerName,
                  position: "Chủ công trình",
                },
              ]
            : [],
    }));
    setShowFormModal(false);
  };

  const handleChange = (field: keyof CreateContractRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddRepresentative = () => {
    setFormData((prev) => ({
      ...prev,
      representatives: [
        ...(prev.representatives || []),
        { name: "", position: "" },
      ],
    }));
  };

  const handleRepresentativeChange = (
    index: number,
    field: keyof Representative,
    value: string,
  ) => {
    const newRepresentatives = [...(formData.representatives || [])];
    newRepresentatives[index] = {
      ...newRepresentatives[index],
      [field]: value,
    };
    handleChange("representatives", newRepresentatives);
  };

  const handleRemoveRepresentative = (index: number) => {
    const newRepresentatives = [...(formData.representatives || [])];
    newRepresentatives.splice(index, 1);
    handleChange("representatives", newRepresentatives);
  };

  const handleAppendixChange = (value: string) => {
    const appendixArray: Appendix[] =
      value && value.trim() ? [{ content: value }] : [];
    handleChange("appendix", appendixArray);
  };

  const getAppendixValue = () => {
    if (Array.isArray(formData.appendix) && formData.appendix.length > 0) {
      return formData.appendix[0].content || "";
    }
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.contractId?.trim()) {
      newErrors.contractId = "Vui lòng nhập mã hợp đồng";
    }
    if (!formData.formCode?.trim()) {
      newErrors.formCode = "Vui lòng chọn mã đơn";
    }
    if (!formData.formNumber?.trim()) {
      newErrors.formNumber = "Vui lòng chọn số đơn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        contractId: formData.contractId,
        formCode: formData.formCode,
        formNumber: formData.formNumber,
        representatives: formData.representatives || [],
        appendix: formData.appendix || [],
      };

      const res = await authFetch("/api/customer/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Tạo hợp đồng thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Tạo hợp đồng thành công",
        color: "success",
      });

      setFormData({
        contractId: "",
        formCode: "",
        formNumber: "",
        representatives: [],
        appendix: [],
      });
      setSelectedForm(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating contract:", error);
      CallToast({
        title: "Lỗi",
        message: error.message || "Tạo hợp đồng thất bại",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      contractId: "",
      formCode: "",
      formNumber: "",
      representatives: [],
      appendix: [],
    });
    setSelectedForm(null);
    setErrors({});
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex gap-3 px-6 pt-6 pb-0">
            <DocumentIcon className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-bold">THÔNG TIN HỢP ĐỒNG CẤP NƯỚC</h3>
              <p className="text-sm text-gray-500">
                Nhập đầy đủ thông tin để tạo hợp đồng mới
              </p>
            </div>
          </CardHeader>
          <Divider />

          <CardBody className="p-6 space-y-6">
            <div>
              <CustomInput
                label="Mã hợp đồng"
                value={formData.contractId || ""}
                onChange={(e) => handleChange("contractId", e.target.value)}
                errorMessage={errors.contractId}
                isRequired
                isInvalid={!!errors.contractId}
              />
            </div>

            <Divider />

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchInputWithButton
                  label="Số đơn"
                  value={formData.formNumber || ""}
                  onValueChange={(value) => handleChange("formNumber", value)}
                  errorMessage={errors.formNumber}
                  isRequired
                  isInvalid={!!errors.formNumber}
                  onSearch={() => setShowFormModal(true)}
                />
                <CustomInput
                  label="Mã đơn"
                  value={formData.formCode || ""}
                  isReadOnly
                  errorMessage={errors.formCode}
                  isInvalid={!!errors.formCode}
                />
              </div>
            </div>

            <Divider />

            {selectedForm && (
              <>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CustomInput
                      label="Tên khách hàng"
                      value={selectedForm?.customerName || ""}
                      isReadOnly
                      startContent={
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      }
                    />
                    <CustomInput
                      label="Địa chỉ"
                      value={selectedForm?.address || ""}
                      isReadOnly
                      startContent={
                        <HomeIcon className="w-4 h-4 text-gray-400" />
                      }
                    />
                    <CustomInput
                      label="Số điện thoại"
                      value={selectedForm?.phoneNumber || ""}
                      isReadOnly
                      startContent={
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                      }
                    />
                    {/* {selectedForm?.email && (
                      <CustomInput
                        label="Email"
                        value={selectedForm.email}
                        isReadOnly
                        startContent={
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        }
                      />
                    )}
                    {selectedForm?.citizenIdentificationNumber && (
                      <CustomInput
                        label="CMND/CCCD"
                        value={selectedForm.citizenIdentificationNumber}
                        isReadOnly
                        startContent={
                          <IdentificationIcon className="w-4 h-4 text-gray-400" />
                        }
                      />
                    )} */}
                  </div>
                </div>
                <Divider />
              </>
            )}

            <div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <CustomButton
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onClick={handleAddRepresentative}
                  >
                    Thêm người đại diện
                  </CustomButton>
                </div>
                {selectedForm?.representatives &&
                  selectedForm.representatives.length > 0 && (
                    <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <p className="text-sm font-medium text-primary mb-2">
                        Người đại diện từ đơn cấp nước:
                      </p>
                      {selectedForm.representatives.map((rep, idx) => (
                        <div key={idx} className="text-sm text-default-700">
                          <span className="font-medium">{rep.name}</span>
                          {rep.position && (
                            <span className="text-default-500">
                              {" "}
                              - {rep.position}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                {(formData.representatives || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    <p>Chưa có người đại diện</p>
                    <p className="text-sm">
                      Nhấn "Thêm người đại diện" để thêm hoặc chọn từ đơn cấp
                      nước
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(formData.representatives || []).map((rep, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start p-3 bg-default-50 rounded-lg"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <CustomInput
                            label="Tên người đại diện"
                            value={rep.name}
                            onChange={(e) =>
                              handleRepresentativeChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                          <CustomInput
                            label="Chức vụ"
                            value={rep.position}
                            onChange={(e) =>
                              handleRepresentativeChange(
                                index,
                                "position",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <Tooltip content="Xóa">
                          <CustomButton
                            isIconOnly
                            color="danger"
                            variant="light"
                            className="mt-2"
                            onClick={() => handleRemoveRepresentative(index)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </CustomButton>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Divider />

            <div>
              <Textarea
                label="Nội dung phụ lục"
                placeholder="Nhập nội dung phụ lục hợp đồng..."
                value={getAppendixValue()}
                onChange={(e) => handleAppendixChange(e.target.value)}
                minRows={4}
                className="resize-none"
              />
            </div>
            <div className="flex justify-end items-end">
              <div className="flex gap-3">
                <CustomButton
                  color="success"
                  startContent={
                    loading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <SaveDocumentCheckIcon className="w-5 h-5" />
                    )
                  }
                  className="font-medium text-white hover:bg-success-600 disabled:bg-success-300 disabled:text-white/50"
                  onClick={handleSubmit}
                  isDisabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu hợp đồng"}
                </CustomButton>
                <CustomButton
                  variant="flat"
                  startContent={<RefreshIcon className="w-5 h-5" />}
                  onClick={handleReset}
                  isDisabled={loading}
                >
                  Làm mới
                </CustomButton>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <LookupModal
        enableSearch={false}
        dataKey="content"
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Chọn đơn cấp nước"
        api="/api/construction/installation-forms"
        columns={[
          { key: "stt", label: "STT" },
          { key: "formNumber", label: "Mã đơn" },
          { key: "customerName", label: "Tên khách hàng" },
          { key: "address", label: "Địa chỉ" },
          { key: "phoneNumber", label: "Số điện thoại" },
        ]}
        mapData={(item: any, index: number) => ({
          stt: index + 1,
          id: item.formCode,
          formNumber: item.formNumber,
          formCode: item.formCode,
          customerId: item.customerId,
          customerName: item.customerName,
          address: item.address,
          phoneNumber: item.phoneNumber,
          email: item.email,
          citizenIdentificationNumber: item.citizenIdentificationNumber,
          overallWaterMeterId: item.overallWaterMeterId,
          representatives: item.representatives,
        })}
        onSelect={handleSelectForm}
      />
    </>
  );
};

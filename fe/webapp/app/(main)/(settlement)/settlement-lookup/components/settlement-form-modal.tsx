"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";

interface SettlementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  initialData?: any;
  onSubmit: (payload: any) => Promise<void>;
}

export const SettlementFormModal = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
}: SettlementFormModalProps) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [displayForm, setDisplayForm] = useState("");
  const [form, setForm] = useState({
    formCode: "",
    formNumber: "",
    jobContent: "",
    address: "",
    connectionFee: "",
    note: "",
    registrationAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "update" && initialData) {
      setForm({
        formCode: initialData.formCode,
        formNumber: initialData.formNumber,
        jobContent: initialData.jobContent || "",
        address: initialData.address || "",
        connectionFee: initialData.connectionFee || "",
        note: initialData.note || "",
        registrationAt: initialData.registrationAt || "",
      });

      setDisplayForm(initialData.formNumber);
    } else if (mode === "create") {
      setForm({
        formCode: "",
        formNumber: "",
        jobContent: "",
        address: "",
        connectionFee: "",
        note: "",
        registrationAt: "",
      });

      setDisplayForm("");
    }
  }, [initialData, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        formCode: form.formCode,
        formNumber: form.formNumber,
        jobContent: form.jobContent,
        address: form.address,
        connectionFee: Number(form.connectionFee),
        note: form.note,
        registrationAt: form.registrationAt,
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAllApproved = (status: any) => {
    return (
      status?.registration === "APPROVED" &&
      status?.estimate === "APPROVED" &&
      status?.contract === "APPROVED" &&
      status?.construction === "APPROVED"
    );
  };

  const handleSelectForm = (item: any) => {
    setForm((prev) => ({
      ...prev,
      formCode: item.formCode,
      formNumber: item.formNumber,
    }));

    setDisplayForm(item.formNumber);
    setShowFormModal(false);
  };

  const statusOptions = [
    { value: "PENDING_FOR_APPROVAL", label: "Chờ duyệt" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "APPROVED", label: "Đã duyệt dự toán" },
    { value: "REJECTED", label: "Lập lại dự toán" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            {mode === "create"
              ? "Tạo quyết toán công trình"
              : "Cập nhật quyết toán"}
          </h2>
        </ModalHeader>

        <ModalBody className="gap-4">
          <SearchInputWithButton
            label="Mã hồ sơ"
            value={displayForm}
            onValueChange={() => {}}
            onSearch={() => setShowFormModal(true)}
          />
          <LookupModal
            dataKey="content"
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            title="Chọn biểu mẫu đủ điều kiện quyết toán"
            api="/api/construction/installation-forms"
            searchKey="keyword"
            columns={[
              { key: "stt", label: "STT" },
              { key: "formCode", label: "Mã form" },
              { key: "formNumber", label: "Số form" },
            ]}
            mapData={(item: any, index: number) => ({
              stt: index + 1,
              id: item.formCode,
              formNumber: item.formNumber,
              formCode: item.formCode,
              disabled: !isAllApproved(item.status),
            })}
            onSelect={(item) => handleSelectForm(item)}
          />
          <CustomInput
            label="Nội dung công việc"
            placeholder="Nhập nội dung công việc"
            value={form.jobContent}
            onChange={(e) => handleChange("jobContent", e.target.value)}
            isRequired
            isInvalid={!!errors.jobContent}
            errorMessage={errors.jobContent}
            variant="bordered"
          />

          <CustomInput
            label="Địa chỉ lắp đặt"
            placeholder="Nhập địa chỉ lắp đặt"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            isRequired
            isInvalid={!!errors.address}
            errorMessage={errors.address}
            variant="bordered"
          />

          <CustomInput
            label="Chi phí đấu nối"
            placeholder="Nhập chi phí đấu nối"
            value={form.connectionFee}
            onChange={(e) => handleChange("connectionFee", e.target.value)}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">₫</span>
              </div>
            }
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
          <Textarea
            label="Ghi chú"
            placeholder="Nhập ghi chú (nếu có)"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
            variant="bordered"
            rows={3}
          />
        </ModalBody>

        <ModalFooter className="gap-2">
          <Button variant="light" onPress={onClose} disabled={loading}>
            Hủy
          </Button>

          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            {mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

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
  const [form, setForm] = useState({
    jobContent: "",
    address: "",
    connectionFee: "",
    note: "",
    status: "",
    registrationAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fill data khi update
  useEffect(() => {
    if (mode === "update" && initialData) {
      setForm({
        jobContent: initialData.jobContent || "",
        address: initialData.address || "",
        connectionFee: initialData.connectionFee || "",
        note: initialData.note || "",
        status: initialData.status || "",
        registrationAt: initialData.registrationAt || "",
      });
    } else if (mode === "create") {
      setForm({
        jobContent: "",
        address: "",
        connectionFee: "",
        note: "",
        status: "PENDING_FOR_APPROVAL",
        registrationAt: "",
      });
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
    // Clear error khi người dùng bắt đầu sửa
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        connectionFee: Number(form.connectionFee),
        status: mode === "create" ? "PENDING_FOR_APPROVAL" : form.status,
        registrationAt: form.registrationAt + "T00:00:00",
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          {mode === "update" && (
            <Select
              label="Trạng thái"
              selectedKeys={[form.status]}
              onSelectionChange={(keys) =>
                handleChange("status", Array.from(keys)[0])
              }
            >
              <SelectItem key="PENDING_FOR_APPROVAL">Chờ duyệt</SelectItem>
              <SelectItem key="PROCESSING">Đang xử lý</SelectItem>
              <SelectItem key="APPROVED">Đã duyệt</SelectItem>
              <SelectItem key="REJECTED">Từ chối</SelectItem>
            </Select>
          )}
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

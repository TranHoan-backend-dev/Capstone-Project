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

    if (!form.formNumber) {
      newErrors.formNumber = "Vui lòng chọn số đơn";
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
        registrationAt: form.registrationAt + "T00:00:00",
        note: form.note,
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">
              {mode === "create"
                ? "Tạo quyết toán công trình"
                : "Cập nhật quyết toán"}
            </h2>
          </ModalHeader>

          <ModalBody className="gap-4">
            {form.formCode && <input type="hidden" value={form.formCode} />}

            <SearchInputWithButton
              label="Số đơn"
              value={form.formNumber}
              onSearch={() => setShowFormModal(true)}
              onChange={(e) => {
                handleChange("formNumber", e.target.value);
                if (!e.target.value) {
                  handleChange("formCode", "");
                  handleChange("address", "");
                  handleChange("jobContent", "");
                }
              }}
              isInvalid={!!errors.formNumber}
              errorMessage={errors.formNumber}
              required
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

      <LookupModal
        dataKey="content"
        enableSearch={false}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Chọn đơn lắp đặt"
        api="/api/construction/installation-forms/completed-without-settlement"
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
        })}
        onSelect={(item) => {
          handleChange("formCode", item.id);
          handleChange("formNumber", item.formNumber);
          handleChange("address", item.address);
          setShowFormModal(false);
        }}
      />
    </>
  );
};

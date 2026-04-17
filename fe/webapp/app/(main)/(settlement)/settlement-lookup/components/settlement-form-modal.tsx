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
    settlementId: "",
    formCode: "",
    formNumber: "",
    customerName: "",
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
      const dataSource = initialData?.generalInformation ?? initialData;
      setForm({
        settlementId: dataSource.settlementId ?? "",
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
        registrationAt: (dataSource.registrationAt ?? "").split("T")[0],
      });

      setDisplayForm(dataSource.formNumber ?? "");
    } else if (mode === "create") {
      setForm({
        settlementId: "",
        formCode: "",
        formNumber: "",
        customerName: "",
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
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

            <CustomInput
              label="Mã quyết toán"
              value={form.settlementId}
              onChange={(e) => handleChange("settlementId", e.target.value)}
              isRequired
              isInvalid={!!errors.settlementId}
              errorMessage={errors.settlementId}
              variant="bordered"
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
          handleChange("address", item.address);
          if (item.jobContent) {
            handleChange("jobContent", item.jobContent);
          }
          setShowFormModal(false);
        }}
      />
    </>
  );
};

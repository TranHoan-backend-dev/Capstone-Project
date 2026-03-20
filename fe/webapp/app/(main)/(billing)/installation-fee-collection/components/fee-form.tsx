"use client";

import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { FeeCollectionFormProps, JobFormProps } from "@/types";
import { Card, CardBody } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";

export const FeeForm = ({
  initialData,
  onSuccess,
  onClose,
}: FeeCollectionFormProps) => {
  const [formCode, setFormCode] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const isEdit = !!initialData?.formCode;

  useEffect(() => {
    if (initialData) {
      setFormCode(initialData.formCode || "");
      setFormNumber(initialData.formNumber || "");
      setReceiptNumber(initialData.receiptNumber || "");
      setCustomerName(initialData.customerName || "");
      setAddress(initialData.address || "");
      setPaymentDate(initialData.paymentDate || "");
      setIsPaid(initialData.isPaid || false);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;

    try {
      setSubmitLoading(true);

      const url = isEdit
        ? `/api/construction/receipts` // update
        : `/api/construction/receipts`; // create (same endpoint, khác method)

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        formCode,
        formNumber,
        receiptNumber,
        customerName,
        address,
        paymentDate,
        isPaid,
      };

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }

      CallToast({
        title: "Thành công",
        message: isEdit
          ? "Cập nhật phiếu thu thành công"
          : "Tạo phiếu thu thành công",
        color: "success",
      });

      onSuccess();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Card shadow="sm" className="rounded-2xl border border-divider bg-content1">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Cập nhật công việc" : "Thêm mới công việc"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <CustomInput
            label="Mã đơn"
            value={formCode}
            onChange={(e) => setFormCode(e.target.value)}
            isDisabled={isEdit}
          />

          <CustomInput
            label="Số đơn"
            value={formNumber}
            onChange={(e) => setFormNumber(e.target.value)}
            isDisabled={isEdit}
          />

          <CustomInput
            label="Số phiếu thu"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
          />

          <CustomInput
            label="Tên khách hàng"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <CustomInput
            label="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <CustomInput
            type="date"
            label="Ngày thanh toán"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            Đã thu tiền
          </label>
          <div className="flex justify-end gap-4">
            <CustomButton variant="light" onPress={onClose}>
              Huỷ
            </CustomButton>
            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
              startContent={
                submitLoading ? null : <CheckApprovalIcon className="w-4 h-4" />
              }
              onPress={handleSubmit}
            >
              {submitLoading ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

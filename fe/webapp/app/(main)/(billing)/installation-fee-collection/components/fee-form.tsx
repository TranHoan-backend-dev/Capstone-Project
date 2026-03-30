"use client";

import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { FeeCollectionFormProps } from "@/types";
import { Card, CardBody } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { numberToVietnamese } from "@/utils/numberToVietnamese";

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
  const [attach, setAttach] = useState("");
  const [paymentReason, setPaymentReason] = useState("");
  const [totalMoneyInDigits, setTotalMoneyInDigits] = useState(0);
  const [totalMoneyInCharacters, setTotalMoneyInCharacters] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    fullname: string;
    role: string;
    significanceUrl: string;
  } | null>(null);

  const isEdit = !!initialData?.receiptNumber;
  const isPrefill = !!initialData?.formCode && !initialData?.formNumber;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await authFetch("/api/auth/me");
        const json = await res.json();
        if (json) {
          setCurrentUser({
            id: json.id,
            fullname: json.fullname,
            role: json.role,
            significanceUrl: json.significanceUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormCode(initialData.formCode || "");
      setFormNumber(initialData.formNumber || "");
      setReceiptNumber(initialData.receiptNumber || "");
      setCustomerName(initialData.customerName || "");
      setAddress(initialData.address || "");
      setPaymentDate(initialData.paymentDate || "");
      setIsPaid(initialData.isPaid || false);
      setAttach(initialData.attach || "");
      setPaymentReason(initialData.paymentReason || "");
      setTotalMoneyInDigits(initialData.totalMoneyInDigits || 0);
      setTotalMoneyInCharacters(initialData.totalMoneyInCharacters || "");
    }
  }, [initialData]);

  const handleTotalMoneyChange = (value: string) => {
    const numValue = Number(value);
    setTotalMoneyInDigits(numValue);

    if (numValue > 0) {
      const words = numberToVietnamese(numValue);
      setTotalMoneyInCharacters(words);
    } else {
      setTotalMoneyInCharacters("");
    }
  };

  // Format date function
  const formatDateForBackend = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      const parts = dateStr.split("-");
      if (parts.length === 3 && parts[0].length === 2) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    } catch (error) {
      console.error("Date format error:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (submitLoading) return;

    // Validate required fields
    if (!formCode || !formNumber) {
      CallToast({
        title: "Lỗi",
        message: "Vui lòng chọn đơn lắp đặt",
        color: "danger",
      });
      return;
    }

    if (!receiptNumber) {
      CallToast({
        title: "Lỗi",
        message: "Vui lòng nhập số phiếu thu",
        color: "danger",
      });
      return;
    }

    try {
      setSubmitLoading(true);

      const url = `/api/construction/receipts`;
      const method = isEdit ? "PUT" : "POST";

      const formattedPaymentDate = formatDateForBackend(paymentDate);

      let payload: any = {
        formCode,
        formNumber,
        receiptNumber,
        customerName,
        address,
        paymentDate: formattedPaymentDate,
        isPaid,
      };

      if (!isEdit) {
        // Validate required fields for create
        if (!paymentReason) {
          CallToast({
            title: "Lỗi",
            message: "Vui lòng nhập lý do thanh toán",
            color: "danger",
          });
          setSubmitLoading(false);
          return;
        }

        if (totalMoneyInDigits <= 0) {
          CallToast({
            title: "Lỗi",
            message: "Vui lòng nhập số tiền thanh toán",
            color: "danger",
          });
          setSubmitLoading(false);
          return;
        }

        payload = {
          ...payload,
          attach: attach || null,
          paymentReason: paymentReason,
          totalMoneyInDigit: totalMoneyInDigits,
          totalMoneyInCharacters: totalMoneyInCharacters || null,
          significanceOfReceiptCreator:
            currentUser?.significanceUrl || "System",
        };
      } else {
        // CẬP NHẬT: Thêm tất cả các field có thể cập nhật
        payload = {
          ...payload,
          // Các field cơ bản
          receiptNumber: receiptNumber,
          customerName: customerName,
          address: address,
          paymentDate: formattedPaymentDate,
          isPaid: isPaid,

          // Các field bổ sung - đảm bảo không bỏ sót
          attach: attach || null,
          paymentReason: paymentReason,
          totalMoneyInDigit: totalMoneyInDigits,
          totalMoneyInCharacters: totalMoneyInCharacters || null,
          significanceOfTreasurer: currentUser?.significanceUrl,
        };
      }

      console.log("Sending payload:", payload);

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
      console.error("Submit error:", e);
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
            {isEdit ? "Cập nhật phiếu thu" : "Thêm mới phiếu thu"}
          </h2>
        </div>

        <div className="px-6 py-5">
          {/* Form Code - Ẩn vì là ID */}
          <CustomInput
            label="Mã đơn"
            value={formCode}
            type="hidden"
            onChange={(e) => setFormCode(e.target.value)}
            isDisabled={isEdit || isPrefill}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cột trái */}
            <div className="space-y-5">
              {/* Form Number - Sử dụng SearchInputWithButton */}
              <SearchInputWithButton
                label="Số đơn"
                value={formNumber}
                onSearch={() => setShowFormModal(true)}
                onChange={(e) => {
                  setFormNumber(e.target.value);
                  if (!e.target.value) {
                    setFormCode("");
                    setCustomerName("");
                    setAddress("");
                  }
                }}
                isDisabled={isEdit || isPrefill}
              />

              <CustomInput
                label="Số phiếu thu"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                required
              />

              <CustomInput
                label="Tên khách hàng"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                isDisabled={true}
              />

              <CustomInput
                label="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                isDisabled={true}
              />

              <CustomInput
                type="date"
                label="Ngày thanh toán"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>

            {/* Cột phải */}
            <div className="space-y-5">
              <CustomInput
                label="Lý do thanh toán"
                value={paymentReason}
                onChange={(e) => setPaymentReason(e.target.value)}
                required
              />

              <CustomInput
                type="number"
                label="Tổng tiền (số)"
                value={totalMoneyInDigits.toString()}
                onChange={(e) => handleTotalMoneyChange(e.target.value)}
                required
              />

              <CustomInput
                label="Tổng tiền (chữ)"
                value={totalMoneyInCharacters}
                onChange={(e) => setTotalMoneyInCharacters(e.target.value)}
                placeholder="Tổng tiền bằng chữ"
                isDisabled={true}
              />

              <CustomInput
                label="File đính kèm"
                value={attach}
                onChange={(e) => setAttach(e.target.value)}
                placeholder="URL hoặc tên file đính kèm"
              />

              <label className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Đã thu tiền</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-divider">
            <CustomButton variant="light" onPress={onClose}>
              Huỷ
            </CustomButton>
            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40"
              startContent={
                submitLoading ? null : <CheckApprovalIcon className="w-4 h-4" />
              }
              onPress={handleSubmit}
              isDisabled={submitLoading}
            >
              {submitLoading ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          </div>
        </div>
      </CardBody>

      {/* Modal chọn đơn lắp đặt */}
      <LookupModal
        dataKey="content"
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
        })}
        onSelect={(item) => {
          setFormCode(item.id);
          setFormNumber(item.formNumber);
          setCustomerName(item.customerName);
          setAddress(item.address);
          setShowFormModal(false);
        }}
      />
    </Card>
  );
};

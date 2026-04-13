"use client";

import React, { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { CustomerInfo } from "./components/customer-info";
import { AddressInfo } from "./components/address-info";
import { TechnicalInfo } from "./components/technical-info";
import { BillingInfo } from "./components/billing-info";

import CustomButton from "@/components/ui/custom/CustomButton";
import { RefreshIcon, SaveIcon } from "@/components/ui/Icons";
import { useCustomerForm } from "@/hooks/useCustomerForm";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";
import { CustomerRegistrationProps } from "@/types";
import {
  validateDigitsOnly,
  validateMoneyInput,
  validatePhone,
  validateText255,
} from "@/utils/validation";

const CustomerRegistration = ({
  initialData,
  onSuccess,
}: CustomerRegistrationProps) => {
  const { formData, updateField, resetForm } = useCustomerForm(initialData);
  const [submitLoading, setSubmitLoading] = useState(false);
  const isEdit = !!initialData?.customerId;

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      if (!formData.name || !formData.formNumber || !formData.formCode) {
        CallToast({
          title: "Lỗi validation",
          message: "Vui lòng điền đầy đủ thông tin bắt buộc",
          color: "warning",
        });
        return;
      }

      const text255Fields: Array<{ value: string; name: string }> = [
        { value: formData.name, name: "Tên khách hàng" },
        { value: formData.address, name: "Địa chỉ" },
        { value: formData.citizenIdentificationProvideAt, name: "Nơi cấp CCCD" },
        {
          value: formData.bankAccountProviderLocation,
          name: "Ngân hàng và chi nhánh",
        },
        { value: formData.bankAccountName, name: "Tên tài khoản" },
        { value: formData.budgetRelationshipCode, name: "Mã số quan hệ ngân sách" },
        { value: formData.passportCode, name: "Mã hộ chiếu" },
        { value: formData.connectionPoint, name: "Điểm đấu nối" },
        { value: formData.taxCode, name: "Mã số thuế" },
      ];

      for (const field of text255Fields) {
        const textError = validateText255(field.value || "", field.name);
        if (textError) {
          CallToast({
            title: "Lỗi validation",
            message: textError,
            color: "warning",
          });
          return;
        }
      }

      if (formData.phoneNumber) {
        const phoneError = validatePhone(formData.phoneNumber);
        if (phoneError) {
          CallToast({
            title: "Lỗi validation",
            message: phoneError,
            color: "warning",
          });
          return;
        }
      }

      if (formData.citizenIdentificationNumber) {
        const cccdError = validateDigitsOnly(
          formData.citizenIdentificationNumber,
          "Số CCCD",
          12,
        );
        if (cccdError) {
          CallToast({
            title: "Lỗi validation",
            message: cccdError,
            color: "warning",
          });
          return;
        }
      }

      const moneyFields: Array<{ value: string | number; name: string }> = [
        { value: formData.protectEnvironmentFee, name: "Phí bảo vệ môi trường" },
        { value: formData.fixRate, name: "Giá cố định" },
        { value: formData.installationFee, name: "Phí lắp đặt" },
        { value: formData.monthlyRent, name: "Tiền thuê hàng tháng" },
        { value: formData.m3Sale, name: "M3 khuyến mãi" },
      ];

      for (const field of moneyFields) {
        const moneyError = validateMoneyInput(field.value, field.name);
        if (moneyError) {
          CallToast({
            title: "Lỗi validation",
            message: moneyError,
            color: "warning",
          });
          return;
        }
      }

      const bankNumberError =
        formData.bankAccountNumber &&
        validateDigitsOnly(
          formData.bankAccountNumber,
          "Số tài khoản ngân hàng",
          16,
        );
      if (bankNumberError) {
        CallToast({
          title: "Lỗi validation",
          message: bankNumberError,
          color: "warning",
        });
        return;
      }
      const cleanData = { ...formData };

      if (cleanData.type) {
        cleanData.type = cleanData.type.toUpperCase();
      }
      const url = isEdit
        ? `/api/customer/customer/${initialData?.customerId}`
        : `/api/customer/customer`;

      const method = isEdit ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }

      CallToast({
        title: "Thành công",
        message: isEdit
          ? "Cập nhật khách hàng thành công"
          : "Tạo khách hàng mới thành công",
        color: "success",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        resetForm();
      }
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
    <Card
      className="border-none rounded-xl bg-content1 overflow-hidden transition-all duration-300"
      shadow="sm"
    >
      <CardBody className="p-0">
        <div className="p-6 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <DocumentPlusIcon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {isEdit ? "Chỉnh sửa khách hàng" : "Nhập khách hàng mới"}
            </h2>
          </div>
        </div>

        <div className="px-6 pb-6 transition-all duration-300 ease-in-out overflow-hidden space-y-6">
          <CustomerInfo formData={formData} onUpdate={updateField} />
          {/* <AddressInfo formData={formData} onUpdate={updateField} /> */}
          <TechnicalInfo formData={formData} onUpdate={updateField} />
          <BillingInfo formData={formData} onUpdate={updateField} />

          <div className="flex justify-end gap-3">
            <CustomButton
              className="w-fit bg-[#22c55e] hover:bg-green-700 text-white px-6 font-bold"
              startContent={<SaveIcon size={18} />}
              onPress={handleSubmit}
              isLoading={submitLoading}
              isDisabled={submitLoading}
            >
              {submitLoading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu"}
            </CustomButton>

            <CustomButton
              className="w-fit bg-[#64748b] hover:bg-slate-600 text-white px-6 font-bold"
              startContent={<RefreshIcon size={18} />}
              onPress={resetForm}
              isDisabled={submitLoading}
            >
              Làm mới
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomerRegistration;

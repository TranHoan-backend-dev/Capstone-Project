// app/customer-registration/page.tsx
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

interface CustomerRegistrationProps {
  initialData?: any;
  onSuccess?: () => void;
}

const CustomerRegistration = ({
  initialData,
  onSuccess,
}: CustomerRegistrationProps) => {
  const { formData, updateField, resetForm } = useCustomerForm(initialData);
  const [submitLoading, setSubmitLoading] = useState(false);
  const isEdit = !!initialData?.id;

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      // Validate required fields
      if (!formData.name || !formData.formNumber || !formData.formCode) {
        CallToast({
          title: "Lỗi validation",
          message: "Vui lòng điền đầy đủ thông tin bắt buộc",
          color: "warning",
        });
        return;
      }

      const url = isEdit
        ? `/api/customer/customer/${initialData?.id}`
        : `/api/customer/customer`;

      const method = isEdit ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

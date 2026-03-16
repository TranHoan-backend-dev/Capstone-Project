"use client";
import React, { useState } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormActions } from "./components/form-actions";
import { OrderInfoSection } from "./components/order-info-section";
import { CustomerInfoSection } from "./components/customer-info-section";
import { AddressContactSection } from "./components/address-contact-section";
import { RelatedOrdersTable } from "./components/related-orders-table";
import { BillingInfoSection } from "./components/billing-info-section";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { NewInstallationFormPayload } from "@/types";
import {
  validateName,
  validateNotFutureDate,
  validateNotPastDate,
  validatePhone,
  validateRequiredFields,
} from "@/utils/validation";

const NewInstallationForm = () => {
  const [keyword, setKeyword] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<NewInstallationFormPayload>({
    formCode: "",
    formNumber: "",
    customerName: "",
    representative: [],
    citizenIdentificationNumber: "",
    citizenIdentificationProvideDate: "",
    citizenIdentificationProvideLocation: "",
    phoneNumber: "",
    taxCode: "",
    address: "",
    bankAccountNumber: "",
    bankAccountProviderLocation: "",
    usageTarget: "DOMESTIC",
    customerType: "FAMILY",
    receivedFormAt: today,
    scheduleSurveyAt: "",
    numberOfHousehold: "",
    householdRegistrationNumber: "",
    networkId: "",
    createdBy: "38e76664-828b-47e8-9504-a713c92484ac",
    overallWaterMeterId: "",
  });

  const updateField = (field: keyof NewInstallationFormPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleCreate = async () => {
    try {
      const requiredError = validateRequiredFields([
        { value: formData.formCode, fieldName: "Mã biểu mẫu" },
        { value: formData.formNumber, fieldName: "Số hồ sơ" },
        { value: formData.customerName, fieldName: "Họ tên khách hàng" },
        { value: formData.phoneNumber, fieldName: "Số điện thoại" },
        { value: formData.address, fieldName: "Địa chỉ" },
        { value: formData.taxCode, fieldName: "Mã số thuế" },
        {
          value: formData.citizenIdentificationNumber,
          fieldName: "Số CCCD",
        },
        {
          value: formData.citizenIdentificationProvideDate,
          fieldName: "Ngày cấp CCCD",
        },
        {
          value: formData.citizenIdentificationProvideLocation,
          fieldName: "Nơi cấp CCCD",
        },
        { value: formData.receivedFormAt, fieldName: "Ngày nhận đơn" },
        { value: formData.scheduleSurveyAt, fieldName: "Ngày hẹn khảo sát" },
        { value: formData.numberOfHousehold, fieldName: "Số hộ sử dụng" },
        {
          value: formData.householdRegistrationNumber,
          fieldName: "Số nhân khẩu",
        },
        { value: formData.networkId, fieldName: "Chi nhánh cấp nước" },
        {
          value: formData.overallWaterMeterId,
          fieldName: "Đồng hồ nước tổng",
        },
        {
          value: formData.bankAccountNumber,
          fieldName: "Số tài khoản ngân hàng",
        },
        {
          value: formData.bankAccountProviderLocation,
          fieldName: "Ngân hàng và chi nhánh",
        },
      ]);

      if (requiredError) return alert(requiredError);
      const phoneError = validatePhone(formData.phoneNumber);
      if (phoneError) return alert(phoneError);

      const nameError = validateName(
        formData.customerName,
        "Họ tên khách hàng",
      );
      if (nameError) return alert(nameError);

      const representativeError = validateName(
        formData.representative?.[0]?.name ?? "",
        "Người đại diện",
      );
      if (representativeError) return alert(representativeError);

      const receivedError = validateNotPastDate(
        formData.receivedFormAt,
        "Ngày nhận đơn",
      );
      if (receivedError) return alert(receivedError);

      const surveyError = validateNotPastDate(
        formData.scheduleSurveyAt,
        "Ngày hẹn khảo sát",
      );
      if (surveyError) return alert(surveyError);

      const citizenError = validateNotFutureDate(
        formData.citizenIdentificationProvideDate,
        "Ngày cấp CCCD",
      );
      if (citizenError) return alert(citizenError);

      const payload = {
        ...formData,
        receivedFormAt: formData.receivedFormAt
          ? new Date(formData.receivedFormAt).toISOString().split("T")[0]
          : "",
        scheduleSurveyAt: formData.scheduleSurveyAt
          ? new Date(formData.scheduleSurveyAt).toISOString().split("T")[0]
          : "",
        citizenIdentificationProvideDate:
          formData.citizenIdentificationProvideDate
            ? new Date(formData.citizenIdentificationProvideDate)
                .toISOString()
                .split("T")[0]
            : "",
      };

      const res = await fetch("/api/construction/installation-forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      alert("Tạo đơn thành công");

      setReloadKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };
  return (
    <>
      <GenericSearchFilter
        isCollapsible
        actions={<FormActions onCreate={handleCreate} />}
        gridClassName="flex flex-col gap-y-2"
        icon={<DocumentPlusIcon className="w-6 h-6" />}
        title="Đơn lắp đặt mới"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderInfoSection formData={formData} updateField={updateField} />
          <CustomerInfoSection formData={formData} updateField={updateField} />
          <AddressContactSection
            formData={formData}
            updateField={updateField}
          />
        </div>
        {/* <BillingInfoSection /> */}
      </GenericSearchFilter>

      <RelatedOrdersTable keyword={keyword} reloadKey={reloadKey} />
    </>
  );
};

export default NewInstallationForm;

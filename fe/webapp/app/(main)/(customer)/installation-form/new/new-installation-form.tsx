"use client";
import React, { useState, useEffect } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormActions } from "./components/form-actions";
import { OrderInfoSection } from "./components/order-info-section";
import { CustomerInfoSection } from "./components/customer-info-section";
import { AddressContactSection } from "./components/address-contact-section";
import { RelatedOrdersTable } from "./components/related-orders-table";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { NewInstallationFormPayload } from "@/types";
import {
  validateCodeField,
  validateDigitsOnly,
  validateName,
  validateNotFutureDate,
  validateNotPastDate,
  validatePhone,
  validateRequiredFields,
  validateTaxCode,
  validateText255,
} from "@/utils/validation";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";

const validateCitizenId = (value: string): string | null => {
  if (!value || !value.trim()) {
    return "Số CCCD không được để trống";
  }
  const cleanValue = value.replace(/\s/g, "");
  if (!/^\d{1,12}$/.test(cleanValue)) {
    return "Số CCCD chỉ được chứa số và tối đa 12 chữ số";
  }
  return null;
};

const NewInstallationForm = () => {
  const [keyword, setKeyword] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);
  const [lastCode, setLastCode] = useState("");
  const [isFetchingCode, setIsFetchingCode] = useState(true);

  const getLastCode = async () => {
    try {
      setIsFetchingCode(true);
      const res = await authFetch(
        "/api/construction/installation-forms/last-code",
      );
      if (!res.ok) {
        throw new Error("Failed to fetch last code");
      }
      const json = await res.json();
      const lastCodeData = json.data;

      setLastCode(lastCodeData);

      if (lastCodeData) {
        updateField("formCode", lastCodeData.formCode || "");
        updateField("formNumber", lastCodeData.formNumber || "");
      }
    } catch (error) {
      console.error("Error fetching last code:", error);
      CallToast({
        title: "Lỗi",
        message: "Không thể lấy mã phiếu cuối cùng. Vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsFetchingCode(false);
    }
  };

  useEffect(() => {
    getLastCode();
  }, []);

  const initialFormData: NewInstallationFormPayload = {
    formCode: "",
    formNumber: "",
    customerName: "",
    representative: [],
    citizenIdentificationNumber: "",
    citizenIdentificationProvideDate: "",
    citizenIdentificationProvideLocation: "Cục Cảnh sát quản lý hành chính về trật tự xã hội",
    phoneNumber: "",
    taxCode: "",
    address: "",
    bankAccountNumber: "",
    bankAccountProviderLocation: "",
    usageTarget: "DOMESTIC",
    customerType: "FAMILY",
    receivedFormAt: today,
    scheduleSurveyAt: "",
    numberOfHousehold: 1,
    householdRegistrationNumber: "",
    networkId: "",
    overallWaterMeterId: "",
  };

  const [formData, setFormData] =
    useState<NewInstallationFormPayload>(initialFormData);

  const updateField = (field: keyof NewInstallationFormPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showError = (message: string) => {
    CallToast({
      title: "Lỗi",
      message,
      color: "danger",
    });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const requiredError = validateRequiredFields([
        { value: formData.formCode, fieldName: "Mã biểu mẫu" },
        { value: formData.formNumber, fieldName: "Số hồ sơ" },
        { value: formData.customerName, fieldName: "Họ tên khách hàng" },
        { value: formData.phoneNumber, fieldName: "Số điện thoại" },
        { value: formData.address, fieldName: "Địa chỉ" },
        { value: formData.citizenIdentificationNumber, fieldName: "Số CCCD" },
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
        { value: formData.overallWaterMeterId, fieldName: "Đồng hồ nước tổng" },
        {
          value: formData.bankAccountNumber,
          fieldName: "Số tài khoản ngân hàng",
        },
        {
          value: formData.bankAccountProviderLocation,
          fieldName: "Ngân hàng và chi nhánh",
        },
      ]);
      if (requiredError) return showError(requiredError);

      const citizenIdError = validateCitizenId(
        formData.citizenIdentificationNumber,
      );
      if (citizenIdError) return showError(citizenIdError);

      const phoneError = validatePhone(formData.phoneNumber);
      if (phoneError) return showError(phoneError);

      const bankAccountError = validateDigitsOnly(
        formData.bankAccountNumber,
        "Số tài khoản ngân hàng",
        16,
      );
      if (bankAccountError) return showError(bankAccountError);

      const nameError = validateName(
        formData.customerName,
        "Họ tên khách hàng",
      );
      if (nameError) return showError(nameError);

      const maxLengthFields: Array<{ value: string; fieldName: string }> = [
        { value: formData.address, fieldName: "Địa chỉ" },
        { value: formData.formCode, fieldName: "Mã biểu mẫu" },
        { value: formData.formNumber, fieldName: "Số hồ sơ" },
        { value: formData.bankAccountNumber, fieldName: "Số tài khoản ngân hàng" },
        {
          value: formData.bankAccountProviderLocation,
          fieldName: "Ngân hàng và chi nhánh",
        },
        {
          value: formData.citizenIdentificationProvideLocation,
          fieldName: "Nơi cấp CCCD",
        },
      ];

      for (const field of maxLengthFields) {
        const fieldError = validateText255(field.value || "", field.fieldName);
        if (fieldError) return showError(fieldError);
      }

      const formCodeError = validateCodeField(formData.formCode, "Mã biểu mẫu");
      if (formCodeError) return showError(formCodeError);

      const formNumberError = validateCodeField(formData.formNumber, "Số hồ sơ");
      if (formNumberError) return showError(formNumberError);

      const taxCodeError = validateTaxCode(formData.taxCode, "Mã số thuế");
      if (taxCodeError) return showError(taxCodeError);

      const householdError =
        formData.householdRegistrationNumber &&
        validateDigitsOnly(
          formData.householdRegistrationNumber,
          "Số nhân khẩu",
          12,
        );
      if (householdError) return showError(householdError);

      // const representativeError = validateName(
      //   formData.representative?.[0]?.name ?? "",
      //   "Người đại diện",
      // );
      // if (representativeError) return showError(representativeError);

      const receivedError = validateNotPastDate(
        formData.receivedFormAt,
        "Ngày nhận đơn",
      );
      if (receivedError) return showError(receivedError);

      const surveyError = validateNotPastDate(
        formData.scheduleSurveyAt,
        "Ngày hẹn khảo sát",
      );
      if (surveyError) return showError(surveyError);

      const citizenDateError = validateNotFutureDate(
        formData.citizenIdentificationProvideDate,
        "Ngày cấp CCCD",
      );
      if (citizenDateError) return showError(citizenDateError);

      const numberOfHousehold = Number(formData.numberOfHousehold);
      const householdRegistrationNumber = Number(
        formData.householdRegistrationNumber,
      );

      if (
        Number.isNaN(numberOfHousehold) ||
        Number.isNaN(householdRegistrationNumber)
      ) {
        return showError("Số hộ sử dụng và số nhân khẩu phải là số hợp lệ");
      }

      const payload = {
        ...formData,
        numberOfHousehold,
        householdRegistrationNumber,
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

      const res = await authFetch("/api/construction/installation-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let userFriendlyMsg = "Có lỗi xảy ra khi tạo đơn. Vui lòng thử lại.";
        try {
          const errJson = await res.json();
          const validationData =
            errJson?.data && typeof errJson.data === "object"
              ? errJson.data
              : errJson?.error?.data && typeof errJson.error.data === "object"
                ? errJson.error.data
                : null;
          let hasValidationDetails = false;

          if (validationData) {
            const validationErrors = Object.entries(validationData)
              .map(([field, message]) => `${field}: ${String(message)}`)
              .join("\n");
            if (validationErrors) {
              userFriendlyMsg = validationErrors;
              hasValidationDetails = true;
            }
          }

          if (errJson?.message?.includes("duplicate key")) {
            userFriendlyMsg = "Số hồ sơ đã tồn tại. Vui lòng nhập số khác.";
          } else if (
            errJson?.message?.includes("citizenIdentificationNumber")
          ) {
            userFriendlyMsg = "Số CCCD đã tồn tại trong hệ thống.";
          } else if (!hasValidationDetails && errJson?.message) {
            userFriendlyMsg = errJson.message;
          }
        } catch {}

        CallToast({ title: "Lỗi", message: userFriendlyMsg, color: "danger" });
        return;
      }

      CallToast({
        title: "Thành công",
        message: "Tạo đơn lắp đặt thành công",
        color: "success",
      });

      await getLastCode();
      setFormData(initialFormData);
      setReloadKey((prev) => prev + 1);
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi tạo đơn",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    getLastCode();
    setFormData(initialFormData);
    setReloadKey((prev) => prev + 1);
  };

  if (isFetchingCode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Đang tải mã phiếu...</div>
      </div>
    );
  }

  return (
    <>
      <GenericSearchFilter
        isCollapsible
        actions={<FormActions onCreate={handleCreate} onClear={handleClear} />}
        gridClassName="flex flex-col gap-y-2"
        icon={<DocumentPlusIcon className="w-6 h-6" />}
        title="Đơn lắp đặt mới"
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          data-enter-navigation
        >
          <OrderInfoSection formData={formData} updateField={updateField} />
          <CustomerInfoSection formData={formData} updateField={updateField} />
          <AddressContactSection
            key={reloadKey}
            formData={formData}
            updateField={updateField}
          />
        </div>
      </GenericSearchFilter>

      <RelatedOrdersTable keyword={keyword} reloadKey={reloadKey} />
    </>
  );
};

export default NewInstallationForm;

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

const NewInstallationForm = () => {
  const [keyword, setKeyword] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
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
    receivedFormAt: "",
    scheduleSurveyAt: "",
    numberOfHousehold: 0,
    householdRegistrationNumber: 0,
    networkId: "3ac28a8e-c3a1-4d94-9708-3354437e39f1",
    createdBy: "38e76664-828b-47e8-9504-a713c92484ac",
    overallWaterMeterId: "00000000-0000-0000-0000-A00000000001",
  });

  const updateField = (field: keyof NewInstallationFormPayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleCreate = async () => {
    try {
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(formData.phoneNumber)) {
        alert("Số điện thoại phải có 10 chữ số");
        return;
      }  

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
        <BillingInfoSection />
      </GenericSearchFilter>

      <RelatedOrdersTable keyword={keyword} reloadKey={reloadKey} />
    </>
  );
};

export default NewInstallationForm;

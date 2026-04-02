import { useState, useEffect } from "react";
import { CreateCustomerPayload } from "@/types/customer";

const initialFormData: CreateCustomerPayload = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "", 
  type: "FAMILY",
  isBigCustomer: false,
  usageTarget: "DOMESTIC",
  numberOfHouseholds: 1,
  householdRegistrationNumber: 0,
  protectEnvironmentFee: 15000,
  waterMeterType: "MECHANICAL",
  citizenIdentificationNumber: "",
  citizenIdentificationProvideAt: "",
  paymentMethod: "CASH",
  bankAccountNumber: "",
  bankAccountProviderLocation: "",
  bankAccountName: "",
  isActive: true,
  roadmapId: "",

  formNumber: "",
  formCode: "",
  waterPriceId: "",
  waterMeterId: "",

  isFree: false,
  isSale: false,
  m3Sale: "0",
  fixRate: "15000",
  installationFee: 500000,
  deductionPeriod: new Date().toISOString().split('T')[0],
  monthlyRent: 50000,
  budgetRelationshipCode: "QH-ND-NAWACO",
  passportCode: "",
  connectionPoint: "Nhà máy nước NAWACO",
  taxCode: "",
};

export const useCustomerForm = (
  initialData?: Partial<CreateCustomerPayload>,
) => {
  const [formData, setFormData] =
    useState<CreateCustomerPayload>(initialFormData);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const updateField = (field: keyof CreateCustomerPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    updateField,
    resetForm,
  };
};

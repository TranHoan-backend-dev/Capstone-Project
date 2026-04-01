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
  protectEnvironmentFee: 0,
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
  fixRate: "0",
  installationFee: 0,
  deductionPeriod: "",
  monthlyRent: 0,
  budgetRelationshipCode: "",
  passportCode: "",
  connectionPoint: "",
  taxCode: "",
  citizenIdentificationProvideLocation: "",
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

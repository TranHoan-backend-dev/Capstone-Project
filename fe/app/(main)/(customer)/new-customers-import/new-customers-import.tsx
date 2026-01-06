"use client";

import { Button } from "@heroui/react";
import { AddressSection } from "./components/(address-contract)/address-section";
import { CustomerInfoSection } from "./components/(customer-info)/customer-info-section";
import { BankInfoSection } from "./components/(bank-info)/bank-info-section";
import { ContractTechnicalSection } from "./components/(contract-technical)/contract-technical-section";
import { SupplementaryInfoSection } from "./components/(supplementary-info)/supplementary-info-section";
import { InvoiceInfoSection } from "./components/invoice-info-section";
import { FormActions } from "./components/form-actions";

const CRMForm = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold">Nhập hồ sơ khách hàng</h1>

      <form className="space-y-6">
        <CustomerInfoSection />
        <AddressSection />
        <BankInfoSection />
        <ContractTechnicalSection />
        <SupplementaryInfoSection />
        <InvoiceInfoSection />

        <div className="flex justify-end gap-3">
          <FormActions />
        </div>
      </form>
    </>
  );
};

export default CRMForm;

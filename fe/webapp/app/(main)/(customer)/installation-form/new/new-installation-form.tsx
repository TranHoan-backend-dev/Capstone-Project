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

const NewInstallationForm = () => {
const [keyword, setKeyword] = useState("");
const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <GenericSearchFilter
        isCollapsible
        actions={<FormActions />}
        gridClassName="flex flex-col gap-y-8"
        icon={<DocumentPlusIcon className="w-6 h-6" />}
        title="Đơn lắp đặt mới"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <OrderInfoSection />
          <CustomerInfoSection />
          <AddressContactSection />
        </div>
        <BillingInfoSection />
      </GenericSearchFilter>

      <RelatedOrdersTable keyword={keyword} reloadKey={reloadKey} />
    </>
  );
};

export default NewInstallationForm;

"use client";

import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import React from "react";

import { FormActions } from "./components/form-actions";
import { OrderInfoSection } from "./components/(order-info)/order-info-section";
import { CustomerInfoSection } from "./components/(customer-info)/customer-info-section";
import { AddressContactSection } from "./components/(address-contact)/address-contact-section";
import { RelatedOrdersTable } from "./components/related-orders-table";
import { InvoiceInfoSection } from "./components/invoice-info-section";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";

const NewInstallationForm = () => {
  const relatedOrders = [
    {
      id: "1",
      code: "DH001234",
      customerName: "Nguyễn Văn An",
      address: "123 Đường ABC, Quận 1",
      stage: "register",
      status: "processing",
    },
    {
      id: "2",
      code: "DH001235",
      customerName: "Trần Thị Bình",
      address: "456 Đường DEF, Quận 3",
      stage: "estimate",
      status: "pending",
    },
    {
      id: "3",
      code: "DH001236",
      customerName: "Lê Minh Cường",
      address: "789 Đường GHI, Quận 5",
      stage: "contract",
      status: "approved",
    },
    {
      id: "4",
      code: "DH001237",
      customerName: "Phạm Thị D",
      address: "111 Đường XYZ",
      stage: "construction",
      status: "rejected",
    },
  ];

  return (
    <>
      <GenericSearchFilter
        isCollapsible
        actions={<FormActions />}
        gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-8"
        icon={<DocumentPlusIcon className="w-6 h-6" />}
        title="Bộ lọc tìm kiếm"
      >
        <OrderInfoSection />
        <CustomerInfoSection />
        <AddressContactSection />
        <InvoiceInfoSection />
      </GenericSearchFilter>

      <RelatedOrdersTable data={relatedOrders} />
    </>
  );
};

export default NewInstallationForm;

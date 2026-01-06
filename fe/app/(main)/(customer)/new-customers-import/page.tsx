import React from "react";
import { Metadata } from "next";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import NewCustomersImport from "./new-customers-import";

export const metadata: Metadata = {
  title: "Nhập khách hàng mới",
  description: "Nhập khách hàng mới",
};

const NewCustomersImportPage = () => {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Nhập khách hàng mới" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />

      <div className="pt-2 space-y-6">
        <NewCustomersImport />
      </div>
    </>
  );
};

export default NewCustomersImportPage;

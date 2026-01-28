import React from "react";
import { Metadata } from "next";

import CustomerRegistration from "./customer-registration";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Nhập khách hàng mới",
  description: "Nhập khách hàng mới",
};

export default function CustomerRegistrationPage() {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Nhập khách hàng mới", isCurrent: true },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />

      <div className="pt-2">
        <CustomerRegistration />
      </div>
    </>
  );
}

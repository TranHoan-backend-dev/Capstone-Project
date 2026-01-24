import React from "react";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import CustomerRegistration from "@/app/(main)/(customer)/import/customer-registration";

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

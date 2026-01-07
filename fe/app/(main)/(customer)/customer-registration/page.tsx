import React from "react";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import CustomerRegistration from "@/app/(main)/(customer)/customer-registration/customer-registration";

export default function CustomerRegistrationPage() {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Kiểm Tra Chỉ Số Đồng Hồ Nước", isCurrent: true },
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

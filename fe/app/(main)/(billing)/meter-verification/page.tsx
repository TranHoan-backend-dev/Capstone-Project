import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import MeterVerificationPage from "@/app/(main)/(billing)/meter-verification/meter-verification";

export const metadata: Metadata = {
  title: "Kiểm tra chỉ số đồng hồ nước | CRM",
  description:
    "Hệ thống quản lý và kiểm tra dữ liệu ghi chỉ số đồng hồ nước khách hàng",
};

export default function page() {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Kiểm Tra Chỉ Số Đồng Hồ Nước", isCurrent: true },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />

      <div className="pt-2 space-y-6">
        <MeterVerificationPage />
      </div>
    </>
  );
}

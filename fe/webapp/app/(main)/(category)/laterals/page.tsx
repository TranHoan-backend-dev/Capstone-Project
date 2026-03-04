import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import LateralPage from "./lateral-page";

export const metadata: Metadata = {
  title: "Quản lý Nhánh tổng",
  description:
    "Thông tin chi tiết danh sách nhánh tổng do Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const Lateral = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Nhánh tổng", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <LateralPage />
      </div>
    </>
  );
};

export default Lateral;
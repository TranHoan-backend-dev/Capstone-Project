import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import DepartmentPage from "./department-page";

export const metadata: Metadata = {
  title: "Quản lý Phòng ban",
  description:
    "Thông tin chi tiết danh sách phòng ban của Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const Department = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Phòng ban", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <DepartmentPage />
      </div>
    </>
  );
};

export default Department;

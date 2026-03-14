import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import EmployeePage from "./employee-page";

export const metadata: Metadata = {
  title: "Quản lý Nhân viên",
  description:
    "Thông tin chi tiết danh sách nhân viên của Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const Employee = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Nhân viên", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <EmployeePage />
      </div>
    </>
  );
};

export default Employee;

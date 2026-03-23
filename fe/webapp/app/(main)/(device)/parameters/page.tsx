import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import ParameterPage from "./parameter-page";

export const metadata: Metadata = {
  title: "Quản lý Tham số hệ thống",
  description:
    "Thông tin chi tiết danh sách tham số hệ thống của Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const Parameter = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Tham số hệ thống", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <ParameterPage />
      </div>
    </>
  );
};

export default Parameter;

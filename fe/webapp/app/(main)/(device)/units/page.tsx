import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import UnitPage from "./unit-page";

export const metadata: Metadata = {
  title: "Quản lý Đơn vị tính",
  description:
    "Thông tin chi tiết danh sách đơn vị tính cho các thiết bị của Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const Unit = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Đơn vị tính", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <UnitPage />
      </div>
    </>
  );
};

export default Unit;
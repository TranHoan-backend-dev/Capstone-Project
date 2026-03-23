import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import NetworksPage from "./networks-page";

export const metadata: Metadata = {
  title: "Quản lý Chi nhánh cấp nước",
  description:
    "Thông tin chi tiết danh sách chi nhánh cấp nước của Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const Networks = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Chi nhánh cấp nước", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <NetworksPage />
      </div>
    </>
  );
};

export default Networks;

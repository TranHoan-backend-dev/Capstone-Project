import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import MaterialGroupPage from "./material-group-page";

export const metadata: Metadata = {
  title: "Quản lý Nhóm vật tư",
  description:
    "Thông tin chi tiết danh sách nhóm vật tư của Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const MaterialsGroup = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Nhóm vật tư", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <MaterialGroupPage />
      </div>
    </>
  );
};

export default MaterialsGroup;
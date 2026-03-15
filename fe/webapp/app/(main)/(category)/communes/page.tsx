import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import CommunePage from "./commune-page";

export const metadata: Metadata = {
  title: "Quản lý Phường/xã",
  description:
    "Thông tin chi tiết danh sách phường/xã do Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const Commune = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Phường/xã", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <CommunePage />
      </div>
    </>
  );
};

export default Commune;

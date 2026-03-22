import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import MaterialPricePage from "./material-price-page";

export const metadata: Metadata = {
  title: "Quản lý Đơn giá vật tư",
  description:
    "Thông tin chi tiết danh sách giá vật tư của Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const MaterialsPrices = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Đơn giá vật tư", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <MaterialPricePage />
      </div>
    </>
  );
};

export default MaterialsPrices;
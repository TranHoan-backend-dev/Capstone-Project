import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import WaterPricePage from "./water-price-page";

export const metadata: Metadata = {
  title: "Quản lý Giá nước",
  description:
    "Thông tin chi tiết danh sách giá nước của Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const WaterPrice = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Giá nước", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <WaterPricePage />
      </div>
    </>
  );
};

export default WaterPrice;
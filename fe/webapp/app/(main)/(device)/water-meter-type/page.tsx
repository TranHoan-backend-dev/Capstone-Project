import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import WaterMeterTypePage from "./water-meter-type";

export const metadata: Metadata = {
  title: "Quản lý Loại đồng hồ nước",
  description:
    "Thông tin chi tiết danh sách loại đồng hồ do Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const WaterMeterType = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Loại đồng hồ nước", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <WaterMeterTypePage />
      </div>
    </>
  );
};

export default WaterMeterType;

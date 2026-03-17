import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import NeighborhoodUnitPage from "./neighborhood-unit-page";

export const metadata: Metadata = {
  title: "Quản lý Tổ/khu phố",
  description:
    "Thông tin chi tiết danh sách tổ/khu phố do Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const Commune = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Tổ/Khu phố", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <NeighborhoodUnitPage />
      </div>
    </>
  );
};

export default Commune;

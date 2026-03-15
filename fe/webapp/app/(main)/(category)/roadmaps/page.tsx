import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import RoadmapPage from "./roadmap-page";

export const metadata: Metadata = {
  title: "Quản lý Lộ trình ghi",
  description:
    "Thông tin chi tiết danh sách lộ trình ghi do Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const Roadmap = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Lộ trình ghi", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <RoadmapPage />
      </div>
    </>
  );
};

export default Roadmap;

import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import HamletPage from "./hamlet-page";

export const metadata: Metadata = {
  title: "Quản lý Thôn/làng",
  description:
    "Thông tin chi tiết danh sách thôn/làng do Công ty Cổ Phần Nước Nam Định - NAWACO quản lý",
};

const Hamlet = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Thôn/làng", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <HamletPage />
      </div>
    </>
  );
};

export default Hamlet;

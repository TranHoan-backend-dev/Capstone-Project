import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import NetworksPage from "./job-page";

export const metadata: Metadata = {
  title: "Quản lý Công việc",
  description:
    "Thông tin chi tiết danh sách công việc của Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const Jobs = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý Công việc", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <NetworksPage />
      </div>
    </>
  );
};

export default Jobs;

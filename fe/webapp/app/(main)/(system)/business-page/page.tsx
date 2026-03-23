import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import BusinessPage from "./business-page";

export const metadata: Metadata = {
  title: "Quản lý danh sách trang doanh nghiệp",
  description:
    "Trang quản lý và tra cứu các trang doanh nghiệp trong hệ thống CMSN",
};

const ManageBusinessPages = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý trang doanh nghiệp", href: "/business-page" },
        ]}
      />

      <div className="space-y-6 pt-2">
        <BusinessPage />
      </div>
    </>
  );
};

export default ManageBusinessPages;

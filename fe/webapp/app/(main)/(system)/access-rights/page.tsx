import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import AccessRightsPage from "./access-rights-page";

export const metadata: Metadata = {
  title: "Quản lý quyền truy cập",
  description:
    "Trang quản lý và tra cứu các trang doanh nghiệp trong hệ thống CMSN",
};

const ManageBusinessPages = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý trang doanh nghiệp", href: "/access-right" },
        ]}
      />

      <div className="space-y-6 pt-2">
        <AccessRightsPage />
      </div>
    </>
  );
};

export default ManageBusinessPages;

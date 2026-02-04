import React from "react";
import { Metadata } from "next";

import ManageMaterialsPage from "./manage-materials";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Quản lý mẫu bốc vật tư",
  description:
    "Trang quản lý và tra cứu các mẫu bốc vật tư vật liệu trong hệ thống CRM.",
};

const ManageSupplies = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Quản lý mẫu bốc vật tư", href: "/material-template" },
        ]}
      />

      <div className="space-y-6 pt-2">
        <ManageMaterialsPage />
      </div>
    </>
  );
};

export default ManageSupplies;

import React from "react";
import { Metadata } from "next";

import RestoreCustomersPage from "./restore-customers";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Khôi phục khách hàng hủy",
  description: "Khôi phục khách hàng hủy",
};

const RestoreCustomerPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Khôi phục khách hàng hủy", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <RestoreCustomersPage />
      </div>
    </>
  );
};

export default RestoreCustomerPage;

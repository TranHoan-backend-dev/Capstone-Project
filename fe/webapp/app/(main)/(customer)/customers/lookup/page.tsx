import React from "react";
import { Metadata } from "next";

import CustomersLookup from "./lookup";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Tra cứu Khách hàng",
  description: "Tra cứu khách hàng",
};

const CustomersPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Tra cứu khách hàng", href: "/customers" },
        ]}
      />

      <div className="space-y-6 pt-2">
        <CustomersLookup />
      </div>
    </>
  );
};

export default CustomersPage;

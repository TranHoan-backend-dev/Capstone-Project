import React from "react";
import { Metadata } from "next";

import Customers from "./customers";

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
        <Customers />
      </div>
    </>
  );
};

export default CustomersPage;

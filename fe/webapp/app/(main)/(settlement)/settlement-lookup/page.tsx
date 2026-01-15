import React from "react";
import { Metadata } from "next";

import SettlementLookupPage from "./settlement-lookup";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Tra cứu quyết toán",
  description: "Tra cứu quyết toán",
};

const SettlementLookup = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Tra cứu quyết toán", href: "/settlement-lookup" },
        ]}
      />

      <div className="space-y-6 pt-2">
        <SettlementLookupPage />
      </div>
    </>
  );
};

export default SettlementLookup;

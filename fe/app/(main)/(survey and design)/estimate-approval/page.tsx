import React from "react";
import { Metadata } from "next";

import EstimateApprovalPage from "./estimate-approval-page";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Duyệt dự toán",
  description: "Duyệt dự toán công trình",
};

const EstimateApproval = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Duyệt dự toán", href: "/estimate-approval" },
        ]}
      />

      <div className="space-y-6 pt-2">
        <EstimateApprovalPage />
      </div>
    </>
  );
};

export default EstimateApproval;

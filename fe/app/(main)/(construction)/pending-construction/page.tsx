"use client";
import React from "react";

import { ConstructionProcessor } from "./components/construction-processor";
import { ApprovedTable, PendingTable } from "./components/construction-tables";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export default function PendingConstructionPage() {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Kiểm Tra Chỉ Số Đồng Hồ Nước", isCurrent: true },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />

      <div className="pt-2 space-y-6">
        <ConstructionProcessor />
        <PendingTable />
        <ApprovedTable />
      </div>
    </>
  );
}

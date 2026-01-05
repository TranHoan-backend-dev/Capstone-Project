"use client";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { ConstructionProcessor } from "./components/construction-processor";
import { ApprovedTable, PendingTable } from "./components/construction-tables";

export default function PendingConstructionPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Xử lý đơn chờ thi công" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <div className="pt-2 space-y-6">
        <ConstructionProcessor />
        <div className="space-y-10">
          <PendingTable />
          <ApprovedTable />
        </div>
      </div>
    </>
  );
}
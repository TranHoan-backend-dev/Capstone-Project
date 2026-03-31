
import { Metadata } from "next";
import React from "react";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import PendingConstructionPage from "./pending-construction-page";

const PendingConstruction = () => {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Kiểm Tra Chỉ Số Đồng Hồ Nước", isCurrent: true },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />

      <div className="pt-2 space-y-6">
        <PendingConstructionPage />
      </div>
    </>
  );
};

export default PendingConstruction;

import React from "react";
import { Metadata } from "next";
import { SettlementRunForm } from "./components/settlement-run-form";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Quyết toán công trình",
  description: "Màn hình tạo và cập nhật quyết toán công trình",
};

const SettlementRunPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const isCreateMode = resolvedParams.id === "new";

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Quản lý quyết toán", href: "/settlement-lookup" },
    { label: isCreateMode ? "Tạo quyết toán" : "Cập nhật quyết toán" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />

      <div className="pt-2 space-y-6">
        <SettlementRunForm id={resolvedParams.id} />
      </div>
    </>
  );
};

export default SettlementRunPage;

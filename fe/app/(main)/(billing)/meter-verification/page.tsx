import React from "react";
import { Metadata } from "next";

import { FilterSection } from "./components/filter-section";
import { CustomerListTable } from "./components/customer-list-table";
import { MeterPreviewCard } from "./components/meter-preview-card";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Kiểm tra chỉ số đồng hồ nước | CRM",
  description:
    "Hệ thống quản lý và kiểm tra dữ liệu ghi chỉ số đồng hồ nước khách hàng",
};

export default function MeterVerificationPage() {
  const mockData = [
    {
      id: 1,
      code: "KH001",
      name: "Nguyễn Văn A",
      oldReadDate: "15/11/2024",
      readDate: "16/11/2024",
      oldIndex: 914,
      newIndex: 934,
      volume: 20,
      isCut: false,
    },
    {
      id: 2,
      code: "KH002",
      name: "Trần Thị B",
      oldReadDate: "14/11/2024",
      readDate: "15/11/2024",
      oldIndex: 894,
      newIndex: 914,
      volume: 20,
      isCut: false,
    },
    {
      id: 3,
      code: "KH003",
      name: "Lê Văn C",
      oldReadDate: "13/11/2024",
      readDate: "14/11/2024",
      oldIndex: 874,
      newIndex: 894,
      volume: 20,
      isCut: false,
    },
    {
      id: 4,
      code: "KH004",
      name: "Phạm Thị D",
      oldReadDate: "12/11/2024",
      readDate: "13/11/2024",
      oldIndex: 854,
      newIndex: 874,
      volume: 20,
      isCut: false,
    },
    {
      id: 5,
      code: "KH005",
      name: "Hoàng Văn E",
      oldReadDate: "11/11/2024",
      readDate: "12/11/2024",
      oldIndex: 834,
      newIndex: 854,
      volume: 20,
      isCut: false,
    },
  ];

  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Kiểm Tra Chỉ Số Đồng Hồ Nước", isCurrent: true },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />

      <div className="pt-2 space-y-6">
        <FilterSection />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9">
            <CustomerListTable data={mockData} />
          </div>
          <div className="lg:col-span-3">
            <MeterPreviewCard />
          </div>
        </div>
      </div>
    </>
  );
}

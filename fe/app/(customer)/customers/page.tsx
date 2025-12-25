"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { CustomerHeader } from "./components/CustomerHeader";
import { FilterSection } from "./components/FilterSection";
import { ResultsTable } from "./components/ResultsTable";

export default function CustomersPage() {
  const branches = [{ label: "Tất cả", value: "all" }];
  const areas = [{ label: "Tất cả", value: "all" }];
  const districts = [{ label: "Tất cả", value: "all" }];
  const wards = [{ label: "Tất cả", value: "all" }];

  const mockData = [
    {
      id: 1,
      customerCode: "001523",
      oldCustomerCode: "NT12450",
      number: "01D226 – 157",
      customerName: "Đặng Thị Như",
      address: "30 Văn Cao, Nam Định",
      status: "Bình thường",
    },
    {
      id: 2,
      customerCode: "001523",
      oldCustomerCode: "NT12450",
      number: "01D226 – 157",
      customerName: "Đặng Thị Như",
      address: "30 Văn Cao, Nam Định",
      status: "Bình thường",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <CustomerHeader />

      <main className="p-8 max-w-[1440px] mx-auto space-y-6">
        <Breadcrumbs variant="light" size="sm" className="text-gray-400">
          <BreadcrumbItem href="/">Trang chủ</BreadcrumbItem>
          <BreadcrumbItem href="/customers" className="font-bold text-[#2563eb]">Khách hàng</BreadcrumbItem>
        </Breadcrumbs>

        <div className="space-y-6">
          <FilterSection
            branches={branches}
            areas={areas}
            districts={districts}
            wards={wards}
          />

          <ResultsTable data={mockData} />
        </div>
      </main>
    </div>
  );
}

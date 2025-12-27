import React from "react";
import { FilterSection } from "./components/filter-section";
import { ResultsTable } from "./components/results-table";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Tra cứu Khách hàng',
  description: 'Tra cứu khách hàng',
}

const CustomersPage = () => {
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
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Tra cứu khách hàng", href: "/customers" },
        ]} />

      <div className="space-y-6 pt-2">
        <FilterSection
          branches={branches}
          areas={areas}
          districts={districts}
          wards={wards}
        />

        <ResultsTable data={mockData} />
      </div>
    </>
  );
};

export default CustomersPage;

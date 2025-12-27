import React from "react";
import { FilterSection } from "./components/filter-section";
import { ResultsTable } from "./components/results-table";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";

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
    <div className="min-h-screen bg-[#f8f9fa]">

      <main className="p-8 max-w-[1440px] mx-auto space-y-6">
        <CustomBreadcrumb items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Khách hàng", href: "/customers" },
        ]} />

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
};

export default CustomersPage;

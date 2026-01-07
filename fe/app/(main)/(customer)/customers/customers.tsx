"use client";

import React from "react";

import { FilterSection } from "./components/filter-section";
import { ResultsTable } from "./components/results-table";

const Customers = () => {
  const branches = [{ label: "Tất cả", value: "all" }];
  const areas = [{ label: "Tất cả", value: "all" }];
  const wards = [{ label: "Tất cả", value: "all" }];
  const neighborhoods = [{ label: "Tất cả", value: "all" }];

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
      customerCode: "001550",
      oldCustomerCode: "NT12488",
      number: "01D228 – 200",
      customerName: "Trần Văn Hùng",
      address: "15 Lê Lợi, Nam Định",
      status: "Chờ duyệt",
    },
    {
      id: 3,
      customerCode: "001560",
      oldCustomerCode: "NT12500",
      number: "01D230 – 045",
      customerName: "Nguyễn Thị Mai",
      address: "45 Hùng Vương, Nam Định",
      status: "Tạm ngưng",
    },
    {
      id: 4,
      customerCode: "001570",
      oldCustomerCode: "NT12510",
      number: "01D232 – 112",
      customerName: "Phạm Văn Đức",
      address: "112 Trần Hưng Đạo, Nam Định",
      status: "Đã khóa",
    },
  ];

  return (
    <>
      <FilterSection
        areas={areas}
        branches={branches}
        wards={wards}
        neighborhoods={neighborhoods}
      />

      <ResultsTable data={mockData} />
    </>
  );
};

export default Customers;

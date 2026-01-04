"use client";

import React from "react";

import { RestoreFilter } from "./components/restore-filter";
import { RestoreTable } from "./components/restore-table";

const RestoreCustomersPage = () => {
  const periodData = [
    { label: "T8/2025", value: "T8/2025" },
    { label: "T7/2025", value: "T7/2025" },
  ];

  const mockData = [
    {
      id: 1,
      customerCode: "001523",
      customerName: "Đặng Thị Như",
      address: "30 Văn Cao, Nam Định",
      restoreDate: "10/05/23 14:22:57",
      period: "T5/2023",
      reason: "NV xóa nhầm",
    },
    {
      id: 2,
      customerCode: "001552",
      customerName: "Lê Thị Như",
      address: "129 Tô Hiến Thành, Nam Định",
      restoreDate: "10/05/22 09:12:57",
      period: "T5/2022",
      reason: "Do CN KD thanh lý nhầm trong danh sách",
    },
    {
      id: 3,
      customerCode: "001552",
      customerName: "Lê Thị Như",
      address: "129 Tô Hiến Thành, Nam Định",
      restoreDate: "10/05/22 09:12:57",
      period: "T5/2022",
      reason: "Do CN KD thanh lý nhầm trong danh sách",
    },
  ];

  return (
    <>
      <RestoreFilter periodData={periodData} />
      <RestoreTable data={mockData} />
    </>
  );
};

export default RestoreCustomersPage;

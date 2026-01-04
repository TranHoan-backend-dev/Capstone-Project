"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";

import { ResultsTable } from "./components/results-table";

import { FilterSection } from "@/components/ui/FilterSection";

const EstimatePreparationPage = () => {
  const mockData: any[] = [
    {
      id: 1,
      code: "0102580016",
      customerName: "Nguyễn Văn Vũ",
      phone: "0913090736",
      address:
        "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
      registerDate: "06/08/2025",
      status: "pending_estimate",
    },
    {
      id: 2,
      code: "0102580015",
      customerName: "Nguyễn Văn Vũ",
      phone: "0913090736",
      address:
        "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
      registerDate: "06/08/2025",
      status: "pending_estimate",
    },
    {
      id: 3,
      code: "0102580014",
      customerName: "Nguyễn Văn Vũ",
      phone: "0913090736",
      address:
        "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
      registerDate: "06/08/2025",
      status: "pending_estimate",
    },
    {
      id: 4,
      code: "0102580012",
      customerName: "Nguyễn Phúc Ánh",
      phone: "0942681788",
      address:
        "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
      registerDate: "06/08/2025",
      status: "rejected",
    },
  ];
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);

  return (
    <>
      <FilterSection
        actions={<></>}
        from={from}
        keyword={keyword}
        setFrom={setFrom}
        setKeyword={setKeyword}
        setTo={setTo}
        title="Bộ lọc"
        to={to}
      />
      <ResultsTable data={mockData} />
    </>
  );
};

export default EstimatePreparationPage;

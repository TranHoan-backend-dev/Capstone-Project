"use client";

import React, { useState } from "react";

import { FilterSection } from "./components/filter-section";
import { ResultsTable } from "./components/results-table";
import { CustomerFilter, CustomerLookupItem } from "@/types";

const CustomersLookup = () => {
  const branches = [{ label: "Tất cả", value: "all" }];
  const areas = [{ label: "Tất cả", value: "all" }];
  const wards = [{ label: "Tất cả", value: "all" }];
  const neighborhoods = [{ label: "Tất cả", value: "all" }];

  const [keyword, setKeyword] = useState<CustomerFilter>({
    name: "",
    phoneNumber: "",
    formNumber: "",
    roadmapId: "",
  });

  const [reloadKey, setReloadKey] = useState(0);

  const handleSearch = (filters: CustomerFilter) => {
    setKeyword(filters);
    setReloadKey((prev) => prev + 1);
  };

  const handleReload = () => setReloadKey((prev) => prev + 1);

  return (
    <>
      <FilterSection
        onSearch={handleSearch}
      />

      <ResultsTable
        keyword={keyword}
        reloadKey={reloadKey}
        onDeleted={handleReload}
      />
    </>
  );
};

export default CustomersLookup;

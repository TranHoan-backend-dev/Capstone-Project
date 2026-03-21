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
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<CustomerLookupItem | null>(null);

  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: CustomerLookupItem) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    handleReload();
    handleCloseForm();
  };

  return (
    <>
      <FilterSection
        areas={areas}
        branches={branches}
        wards={wards}
        neighborhoods={neighborhoods}
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

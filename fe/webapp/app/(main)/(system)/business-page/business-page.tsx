"use client";

import React, { useState } from "react";
import { FilterSection } from "./components/filter-section";
import { BusinessPageTable } from "./components/business-page-table";
import { BusinessPageItem } from "@/types";

const BusinessPage = () => {
  const [filter, setFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<BusinessPageItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };
  const handleEdit = (item: BusinessPageItem) => {
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
        filter={filter}
        onSearch={setFilter}
        onAddNew={handleAddNew}
      />
      <BusinessPageTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={(item) => {
          setEditingItem(item);
          setShowAddForm(true);
        }}
        onDelete={() => setReloadKey((prev) => prev + 1)}
      />
    </>
  );
};

export default BusinessPage;

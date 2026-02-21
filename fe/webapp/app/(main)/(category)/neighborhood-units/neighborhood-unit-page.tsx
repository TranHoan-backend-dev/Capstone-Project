"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { FilterSection } from "./components/filter-section";
import { NeighborhoodUnitFilter, NeighborhoodUnitItem } from "@/types";
import { NeighborhoodUnitForm } from "./components/neighborhood-unit-form";
import { NeighborhoodUnitTable } from "./components/neighborhood-unit-table";

const NeighborhoodUnitPage = () => {
  const [filter, setFilter] = useState<NeighborhoodUnitFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<NeighborhoodUnitItem | null>(
    null,
  );
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: NeighborhoodUnitItem) => {
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

      {showAddForm && (
        <NeighborhoodUnitForm
          key={editingItem?.id || "create"}
          initialData={editingItem || undefined}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      <NeighborhoodUnitTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default NeighborhoodUnitPage;

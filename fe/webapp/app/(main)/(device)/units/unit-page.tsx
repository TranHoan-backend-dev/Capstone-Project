"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { FilterSection } from "./components/filter-section";
import { UnitForm } from "./components/unit-form";
import { UnitTable } from "./components/unit-table";
import { UnitItem } from "@/types";

const UnitPage = () => {
  const [filter, setFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<UnitItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: UnitItem) => {
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
        <UnitForm
          key={editingItem?.id || "create"}
          initialData={editingItem || undefined}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      <UnitTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default UnitPage;
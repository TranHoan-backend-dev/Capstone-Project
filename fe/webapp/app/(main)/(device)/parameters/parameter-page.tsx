"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { ParameterTable } from "./components/parameter-table";
import { FilterSection } from "./components/filter-section";
import { ParameterForm } from "./components/parameter-form";
import { ParameterItem } from "@/types";

const ParameterPage = () => {
  const [filter, setFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<ParameterItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: ParameterItem) => {
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
        <ParameterForm
          key={editingItem?.id || "create"}
          initialData={editingItem || undefined}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      <ParameterTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default ParameterPage;

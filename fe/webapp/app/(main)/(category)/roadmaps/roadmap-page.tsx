"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { RoadmapTable } from "./components/roadmap-table";
import { FilterSection } from "./components/filter-section";
import { RoadmapForm } from "./components/roadmap-form";
import { RoadmapFilter, RoadmapItem } from "@/types";

const RoadmapPage = () => {
  const [filter, setFilter] = useState<RoadmapFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: RoadmapItem) => {
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
        <RoadmapForm
          key={editingItem?.id || "create"}
          initialData={editingItem || undefined}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      <RoadmapTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default RoadmapPage;

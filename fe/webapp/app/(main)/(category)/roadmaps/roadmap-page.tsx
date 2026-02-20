"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { RoadmapTable } from "./components/roadmap-table";
import { FilterSection } from "./components/filter-section";
import { RoadmapForm } from "./components/roadmap-form";
import { RoadmapItem } from "@/types";

const RoadmapPage = () => {
  const [keyword, setKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  return (
    <>
      <FilterSection
        keyword={keyword}
        onSearch={setKeyword}
        onAddNew={handleAddNew}
      />

      {showAddForm && (
        <RoadmapForm
          initialData={editingItem || undefined}
          onSuccess={() => {
            setReloadKey((prev) => prev + 1);
          }}
          onClose={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
        />
      )}

      <RoadmapTable
        keyword={keyword}
        reloadKey={reloadKey}
        onEdit={(item) => {
          setEditingItem(item);
          setShowAddForm(true);
        }}
        onDeleted={() => setReloadKey((prev) => prev + 1)}
      />
    </>
  );
};

export default RoadmapPage;

"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { LateralTable } from "./components/lateral-table";
import { FilterSection } from "./components/filter-section";
import { LateralForm } from "./components/lateral-form";
import { LateralItem } from "@/types";

const LateralPage = () => {
  const [keyword, setKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<LateralItem | null>(null);
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
        <LateralForm
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

      <LateralTable
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

export default LateralPage;

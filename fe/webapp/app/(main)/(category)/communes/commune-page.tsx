"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { CommuneTable } from "./components/commune-table";
import { FilterSection } from "./components/filter-section";
import { CommuneForm } from "./components/commune-form";
import { CommuneItem } from "@/types";

const CommunePage = () => {
  const [keyword, setKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<CommuneItem | null>(null);
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
        <CommuneForm
          initialData={editingItem || undefined}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingItem(null);
            setReloadKey((prev) => prev + 1);
          }}
        />
      )}

      <CommuneTable
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

export default CommunePage;

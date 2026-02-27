"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { LateralTable } from "./components/lateral-table";
import { FilterSection } from "./components/filter-section";
import { LateralForm } from "./components/lateral-form";
import { LateralFilter, LateralItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";

const LateralPage = () => {
  const [filter, setFilter] = useState<LateralFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<LateralItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: LateralItem) => {
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

      <Modal
        isOpen={showAddForm}
        onClose={handleCloseForm}
        size="2xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <LateralForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <LateralTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default LateralPage;

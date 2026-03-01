"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { FilterSection } from "./components/filter-section";
import { RoadForm } from "./components/road-form";
import { RoadTable } from "./components/road-table";
import { RoadItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";

const RoadPage = () => {
  const [keyword, setKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<RoadItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: RoadItem) => {
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
        keyword={keyword}
        onSearch={setKeyword}
        onAddNew={handleAddNew}
      />

      <Modal
        isOpen={showAddForm}
        onClose={handleCloseForm}
        size="3xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <RoadForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <RoadTable
        keyword={keyword}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default RoadPage;

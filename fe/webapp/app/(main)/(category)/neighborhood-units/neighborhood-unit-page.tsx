"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { FilterSection } from "./components/filter-section";
import { NeighborhoodUnitFilter, NeighborhoodUnitItem } from "@/types";
import { NeighborhoodUnitForm } from "./components/neighborhood-unit-form";
import { NeighborhoodUnitTable } from "./components/neighborhood-unit-table";
import { Modal, ModalContent } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";

const NeighborhoodUnitPage = () => {
  const [filter, setFilter] = useState<NeighborhoodUnitFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<NeighborhoodUnitItem | null>(
    null,
  );
  const { profile, loading } = useEmployeeProfile();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="text-center text-red-500 py-10">
        Không thể tải thông tin người dùng
      </div>
    );
  }
  
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
        size="3xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <NeighborhoodUnitForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

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

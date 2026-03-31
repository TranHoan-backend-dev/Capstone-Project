"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { FilterSection } from "./components/filter-section";
import { UnitForm } from "./components/unit-form";
import { UnitTable } from "./components/unit-table";
import { UnitFilter, UnitItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { useProfile } from "@/hooks/useLogin";

const UnitPage = () => {
  const [filter, setFilter] = useState<UnitFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<UnitItem | null>(null);
  const { profile, loading } = useProfile();

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
        size="2xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <UnitForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

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

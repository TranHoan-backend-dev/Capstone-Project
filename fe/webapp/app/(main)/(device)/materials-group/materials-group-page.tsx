"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { FilterSection } from "./components/filter-section";
import { MaterialGroupFilter, MaterialGroupItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";
import { MaterialsGroupTable } from "./components/materials-group-table";
import { MaterialsGroupForm } from "./components/materials-group-form";
import { useProfile } from "@/hooks/useLogin";

const MaterialsGroupPage = () => {
  const [filter, setFilter] = useState<MaterialGroupFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<MaterialGroupItem | null>(
    null,
  );
  const { profile, loading } = useProfile();
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: MaterialGroupItem) => {
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
      <div className="flex items-center gap-2 text-sm text-default-500">
        <Spinner size="sm" />
        <span>Đang tải thông tin...</span>
      </div>
    );
  }

  if (!profile) {
    return <p>Không thể tải danh sách vật liệu</p>;
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
        <MaterialsGroupForm
          key={editingItem?.id || "create"}
          initialData={editingItem || undefined}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
        </ModalContent>
      </Modal>
      <MaterialsGroupTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default MaterialsGroupPage;

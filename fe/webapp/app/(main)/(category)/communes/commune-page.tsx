"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { CommuneTable } from "./components/commune-table";
import { FilterSection } from "./components/filter-section";
import { CommuneForm } from "./components/commune-form";
import { CommuneFilter, CommuneItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";

const CommunePage = () => {
  const [keyword, setKeyword] = useState<CommuneFilter>({
    name: "",
    type: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<CommuneItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const { profile, loading } = useEmployeeProfile();

  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: CommuneItem) => {
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
          <CommuneForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <CommuneTable
        filter={keyword}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default CommunePage;

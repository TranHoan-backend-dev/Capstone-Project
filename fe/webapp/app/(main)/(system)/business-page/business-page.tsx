"use client";

import React, { useState } from "react";
import { ButtonSection } from "./components/button-section";
import { BusinessPageTable } from "./components/business-page-table";
import { BusinessPageItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";
import { BusinessPageForm } from "./components/business-page-form";

const BusinessPage = () => {
  const [filter, setFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<BusinessPageItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };
  const handleEdit = (item: BusinessPageItem) => {
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
      <ButtonSection onAddNew={handleAddNew} />
      <Modal
        isOpen={showAddForm}
        onClose={handleCloseForm}
        size="3xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <BusinessPageForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <BusinessPageTable
        onEdit={(item) => {
          setEditingItem(item);
          setShowAddForm(true);
        }}
        onDeleted={handleReload}
      />
    </>
  );
};

export default BusinessPage;

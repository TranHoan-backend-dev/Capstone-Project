"use client";

import React, { useState } from "react";
import { ButtonSection } from "./components/button-section";
import { BusinessPageTable } from "./components/business-page-table";
import { BusinessPageItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";
import { BusinessPageForm } from "./components/business-page-form";
import { useProfile } from "@/hooks/useLogin";

const BusinessPage = () => {
  const [filter, setFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<BusinessPageItem | null>(null);
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");

  const canView = isITStaff;
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
  if (!canView) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
      </div>
    );
  }
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

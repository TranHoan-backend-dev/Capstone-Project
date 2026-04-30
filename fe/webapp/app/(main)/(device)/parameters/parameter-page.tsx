"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { ParameterTable } from "./components/parameter-table";
import { FilterSection } from "./components/filter-section";
import { ParameterForm } from "./components/parameter-form";
import { ParameterItem } from "@/types";
import { Modal, ModalContent } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { useProfile } from "@/hooks/useLogin";

const ParameterPage = () => {
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<ParameterItem | null>(null);

  const handleReload = () => setReloadKey((prev) => prev + 1);

  const handleEdit = (item: ParameterItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    handleReload();
    handleCloseForm();
  };
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");

  const canView = isITStaff;
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
  if (profileLoading) {
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
      <FilterSection filter={filter} onSearch={setFilter} />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        size="3xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ParameterForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <ParameterTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
      />
    </>
  );
};

export default ParameterPage;

"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { useIsITStaff } from "@/hooks/useHasRole";
import { NetworksTable } from "./components/networks-table";
import { FilterSection } from "./components/filter-section";
import { NetworkForm } from "./components/network-form";
import { Modal, ModalContent } from "@heroui/react";
import { NetworksFilter, NetworksItem } from "@/types";
import { useProfile } from "@/hooks/useLogin";

const NetworksPage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { isITStaff, loading: roleLoading } = useIsITStaff();
  const loading = profileLoading || roleLoading;
  const [keyword, setKeyword] = useState<NetworksFilter>({
    name: "",
    type: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<NetworksItem | null>(null);

  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: NetworksItem) => {
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
    return <p>Không thể tải danh sách chi nhánh cấp nước</p>;
  }

  // Chỉ IT_STAFF mới được truy cập trang này
  if (!isITStaff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">Truy cập bị từ chối</h1>
          <p className="text-default-500">
            Tính năng quản lý chi nhánh cấp nước chỉ dành cho nhân viên IT.
          </p>
          <p className="text-sm text-default-400 mt-2">
            Nếu bạn là nhân viên IT, vui lòng liên hệ quản trị viên hệ thống.
          </p>
        </div>
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
          <NetworkForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <NetworksTable
        keyword={keyword}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default NetworksPage;

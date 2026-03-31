"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { useIsITStaff } from "@/hooks/useHasRole";
import { FilterSection } from "./components/filter-section";
import { Modal, ModalContent } from "@heroui/react";
import { JobFilter, JobItem } from "@/types";
import { JobForm } from "./components/job-form";
import { JobsTable } from "./components/job-table";
import { useProfile } from "@/hooks/useLogin";


const JobPage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { isITStaff, loading: roleLoading } = useIsITStaff();
  const loading = profileLoading || roleLoading;
  const [keyword, setKeyword] = useState<JobFilter>({
    name: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<JobItem | null>(null);

  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: JobItem) => {
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
    return <p>Không thể tải danh sách công việc</p>;
  }

  // Chỉ IT_STAFF mới được truy cập trang này
  if (!isITStaff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">
            Truy cập bị từ chối
          </h1>
          <p className="text-default-500">
            Tính năng quản lý công việc chỉ dành cho nhân viên IT.
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
          <JobForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <JobsTable
        keyword={keyword}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default JobPage;

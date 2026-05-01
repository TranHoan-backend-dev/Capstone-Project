"use client";

import React, { useEffect, useState } from "react";

import { Spinner } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { useIsITStaff } from "@/hooks/useHasRole";
import { Modal, ModalContent } from "@heroui/react";
import { FeeTable } from "./components/fee-table";
import { FeeCollectionFilter, FeeCollectionItem } from "@/types";
import { FilterSection } from "./components/filter-section";
import { FeeForm } from "./components/fee-form";
import { useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useLogin";

const FeeCollectionPage = () => {
  const [filter, setFilter] = useState<FeeCollectionFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const searchParams = useSearchParams();
  const formCodeParam = searchParams.get("formCode") || "";
  const formNumberParam = searchParams.get("formNumber") || "";
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");
  const isCompanyLeader = hasRole("company_leadership");
  const isPlanningTechnicalHead = hasRole("planning_technical_department_head");
  const isOrderReceivingStaff = hasRole("order_receiving_staff");
  const isSurveyStaff = hasRole("survey_staff");
  const isConstructionHead = hasRole("construction_department_head");
  const isConstructionStaff = hasRole("construction_department_staff");
  const isFinanceStaff = hasRole("finance_department");
  const canView = isITStaff || isFinanceStaff || isOrderReceivingStaff;
  const [editingItem, setEditingItem] = useState<FeeCollectionItem | null>(
    null,
  );
  useEffect(() => {
    if (formCodeParam && formNumberParam) {
      setEditingItem({
        formCode: formCodeParam,
        formNumber: formNumberParam,
      } as FeeCollectionItem);
      setShowAddForm(true);
    }
  }, [formCodeParam, formNumberParam]);

  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: FeeCollectionItem) => {
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

  const handleSearch = (searchFilters: {
    name?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    setFilter(searchFilters);
  };

  if (profileLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-default-500">
        <Spinner size="sm" />
        <span>Đang tải thông tin...</span>
      </div>
    );
  }

  if (!profile) {
    return <p>Không thể tải thông tin người dùng</p>;
  }
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
      <FilterSection
        filter={filter}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
      />

      <Modal
        isOpen={showAddForm}
        onClose={handleCloseForm}
        size="5xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <FeeForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>
      <FeeTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default FeeCollectionPage;

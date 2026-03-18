"use client";

import React from "react";

import { Spinner } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { MaterialsGroupTable } from "./components/materials-group-table";
import { FilterSection } from "./components/filter-section";

const MaterialsGroupPage = () => {
  const { profile, loading } = useEmployeeProfile();

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
      <FilterSection />
      <MaterialsGroupTable />
    </>
  );
};

export default MaterialsGroupPage;

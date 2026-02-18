"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { NetworksTable } from "./components/networks-table";
import { FilterSection } from "./components/filter-section";
import { NetworkForm } from "./components/network-form";

const NetworksPage = () => {
  const { profile, loading } = useEmployeeProfile();
  const [keyword, setKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

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

  return (
    <>
      <FilterSection
        keyword={keyword}
        onSearch={setKeyword}
        onAddNew={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <NetworkForm
          onSuccess={() => {
            setShowAddForm(false);
            setReloadKey((prev) => prev + 1);
          }}
        />
      )}

      <NetworksTable keyword={keyword} reloadKey={reloadKey} />
    </>
  );
};

export default NetworksPage;

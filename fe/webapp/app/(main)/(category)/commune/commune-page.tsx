"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { CommuneTable } from "./components/commune-table";
import { FilterSection } from "./components/filter-section";
import { CommuneForm } from "./components/commune-form";

const CommunePage = () => {
  const [keyword, setKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <FilterSection
        keyword={keyword}
        onSearch={setKeyword}
        onAddNew={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <CommuneForm
          onSuccess={() => {
            setShowAddForm(false);
            setReloadKey((prev) => prev + 1);
          }}
        />
      )}

      <CommuneTable keyword={keyword} reloadKey={reloadKey} />
    </>
  );
};

export default CommunePage;

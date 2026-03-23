"use client";

import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { FilterSection } from "./components/filter-section";

import { Modal, ModalContent } from "@heroui/react";
import { WaterMeterFilter, WaterMeterItem } from "@/types";
import { WaterMeterForm } from "./components/water-meter-form";
import { WaterMeterTable } from "./components/water-meter-table";

const WaterMeterTypePage = () => {
  const [filter, setFilter] = useState<WaterMeterFilter>({
    name: "",
    meterModel: "",
    maxIndex: "",
    diameter: "",
    origin: "",
    size: "",
    qn: "",
    qt: "",
    qmin: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingItem, setEditingItem] = useState<WaterMeterItem | null>(null);
  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: WaterMeterItem) => {
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
      <FilterSection
        filter={filter}
        onSearch={setFilter}
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
          <WaterMeterForm
            key={editingItem?.id || "create"}
            initialData={editingItem || undefined}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </ModalContent>
      </Modal>

      <WaterMeterTable
        filter={filter}
        reloadKey={reloadKey}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </>
  );
};

export default WaterMeterTypePage;

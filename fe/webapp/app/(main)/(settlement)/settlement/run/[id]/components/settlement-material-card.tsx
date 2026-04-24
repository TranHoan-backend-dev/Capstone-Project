"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { DeleteIcon } from "@/config/chip-and-icon";
import { MaterialEstimateItem, SettlementResponse } from "@/types";
import { ESTIMATE_COLUMN } from "@/config/table-columns";
import { LookupModal } from "@/components/ui/modal/LookupModal";

interface SettlementMaterialCardProps {
  settlementId: string;
  settlementData: SettlementResponse | null;
  materials: MaterialEstimateItem[];
  setMaterials: React.Dispatch<React.SetStateAction<MaterialEstimateItem[]>>;
  isReadOnly?: boolean;
}

export const SettlementMaterialCard = ({
  settlementId,
  settlementData,
  materials,
  setMaterials,
  isReadOnly = false,
}: SettlementMaterialCardProps) => {
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have settlementData and materials are empty (initial load)
    if (settlementData && materials.length === 0) {
      const sourceMaterials = settlementData.baseMaterials;
      if (Array.isArray(sourceMaterials) && sourceMaterials.length > 0) {
        const mappedMaterials = sourceMaterials.map(
          (item: any, index: number) => {
            const quantity = parseFloat(item.mass) || 0;
            const materialPrice = parseFloat(item.materialCost) || 0;
            const laborPrice = parseFloat(item.laborPrice) || 0;

            return {
              id: item.materialCode || `mat-${index}`,
              code: item.materialCode,
              description: item.jobContent,
              unit: item.unit,
              quantity: quantity || 1,
              materialPrice: materialPrice,
              laborPrice: laborPrice,
              materialTotal: quantity * materialPrice,
              laborTotal: laborPrice,
              note: item.note || "",
              stt: index + 1,
            };
          },
        );
        setMaterials(mappedMaterials);
      }
    }
    setLoading(false);
  }, [settlementData]);

  const handleChange = (
    id: string,
    field: keyof MaterialEstimateItem,
    value: any,
  ) => {
    if (isReadOnly) return;
    setMaterials((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        updated.materialTotal = updated.quantity * updated.materialPrice;
        updated.laborTotal = updated.laborPrice;

        return updated;
      }),
    );
  };

  const renderCell = (item: MaterialEstimateItem, columnKey: string) => {
    switch (columnKey) {
      case "code":
        return <span className="font-medium">{item.code}</span>;
      case "description":
        return <span>{item.description}</span>;
      case "unit":
        return <span>{item.unit}</span>;
      case "quantity":
        return (
          <Input
            value={String(item.quantity || "")}
            onChange={(e) => {
              const val = e.target.valueAsNumber;
              if (!isNaN(val)) handleChange(item.id, "quantity", val);
            }}
            size="sm"
            type="number"
            step="0.1"
            isDisabled={isReadOnly}
          />
        );
      case "materialPrice":
        return (
          <Input
            value={String(item.materialPrice || "")}
            onChange={(e) => {
              const val = e.target.valueAsNumber;
              if (!isNaN(val)) handleChange(item.id, "materialPrice", val);
            }}
            size="sm"
            type="number"
            step="1000"
            isDisabled={isReadOnly}
          />
        );
      case "laborPrice":
        return (
          <Input
            value={String(item.laborPrice || "")}
            onChange={(e) => {
              const val = e.target.valueAsNumber;
              if (!isNaN(val)) handleChange(item.id, "laborPrice", val);
            }}
            size="sm"
            type="number"
            step="1000"
            isDisabled={isReadOnly}
          />
        );
      case "materialTotal":
        return (
          <span className="text-right block">
            {item.materialTotal.toLocaleString("vi-VN")}
          </span>
        );
      case "laborTotal":
        return (
          <span className="text-right block">
            {item.laborTotal.toLocaleString("vi-VN")}
          </span>
        );
      case "note":
        return (
          <Input
            value={item.note || ""}
            onChange={(e) => handleChange(item.id, "note", e.target.value)}
            size="sm"
            isDisabled={isReadOnly}
          />
        );
      case "actions":
        return (
          <Tooltip closeDelay={0} color="danger" content="Xóa">
            <Button
              isIconOnly
              className="text-danger hover:bg-danger-50 dark:hover:bg-danger-900/10"
              size="sm"
              variant="light"
              onClick={() =>
                setMaterials((prev) => prev.filter((m) => m.id !== item.id))
              }
              isDisabled={isReadOnly}
            >
              <DeleteIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
        );
      default:
        return item[columnKey as keyof MaterialEstimateItem];
    }
  };

  const handleSelectMaterial = (item: any) => {
    if (isReadOnly) return;
    setMaterials((prev) => {
      if (prev.find((m) => m.id === item.id)) return prev;

      const newItem: MaterialEstimateItem = {
        id: item.id,
        code: item.code,
        description: item.name,
        unit: item.unit,
        quantity: 1,
        materialPrice: item.price,
        laborPrice: 0,
        materialTotal: item.price,
        laborTotal: 0,
        note: "",
        stt: prev.length + 1,
      };

      return [...prev, newItem];
    });

    setShowMaterialModal(false);
  };

  return (
    <div className="space-y-4">
      <GenericDataTable
        columns={ESTIMATE_COLUMN}
        data={materials}
        renderCellAction={renderCell}
        tableProps={{
          className: "pt-0",
        }}
        title="Vật tư quyết toán"
        topContent={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <SearchInputWithButton
              label="Chọn vật tư"
              onSearch={() => {
                if (isReadOnly) return;
                setShowMaterialModal(true);
              }}
              isDisabled={isReadOnly}
            />
          </div>
        }
      />

      <LookupModal
        isOpen={showMaterialModal}
        dataKey="content"
        onClose={() => setShowMaterialModal(false)}
        title="Chọn vật tư"
        api="/api/device/materials-prices"
        columns={[
          { key: "code", label: "Mã vật tư" },
          { key: "name", label: "Tên vật tư" },
          { key: "unit", label: "ĐVT" },
          { key: "price", label: "Đơn giá" },
        ]}
        mapData={(item: any) => ({
          id: item.id,
          code: item.laborCode,
          name: item.jobContent,
          unit: item.unitName,
          price: item.price,
        })}
        onSelect={handleSelectMaterial}
      />
    </div>
  );
};

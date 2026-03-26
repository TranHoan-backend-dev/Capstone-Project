"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import {
  ApprovalIcon,
  DeleteIcon,
  DocumentChartIcon,
  DocumentMagnifyGlassIcon,
  SaveDocumentCheckIcon,
} from "@/config/chip-and-icon";
import CustomButton from "@/components/ui/custom/CustomButton";
import { EstimateItem, EstimateResponse, MaterialEstimateItem } from "@/types";
import { ESTIMATE_COLUMN } from "@/config/table-columns";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { CallToast } from "@/components/ui/CallToast";

interface MaterialCostCardProps {
  estimateId: string;
  estimateData: EstimateResponse | null;
  setEstimateData: React.Dispatch<
    React.SetStateAction<EstimateResponse | null>
  >;
  materials: MaterialEstimateItem[];
  setMaterials: React.Dispatch<React.SetStateAction<MaterialEstimateItem[]>>;
}

export const MaterialCostCard = ({
  estimateId,
  estimateData,
  setEstimateData,
  materials,
  setMaterials,
}: MaterialCostCardProps) => {
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (estimateData?.material) {
      const mappedMaterials = estimateData.material.map(
        (item: any, index: number) => ({
          id: item.materialCode,
          code: item.materialCode,
          description: item.jobContent,
          unit: item.unit,
          quantity: parseFloat(item.mass) || 0,
          materialPrice: parseFloat(item.materialCost) || 0,
          laborPrice: parseFloat(item.laborPrice) || 0,
          materialTotal: parseFloat(item.totalMaterialPrice) || 0,
          laborTotal: parseFloat(item.totalLaborPrice) || 0,
          note: item.note || "",
          stt: index + 1,
        }),
      );
      setMaterials(mappedMaterials);
    }
    setLoading(false);
  }, [estimateData]);

  const handleSave = async (isFinished: boolean) => {
    try {
      const materialPayload = materials.map((m) => ({
        materialCode: m.id,
        jobContent: m.description,
        note: m.note,
        unit: m.unit,
        mass: m.quantity.toString(),
        materialCost: m.materialPrice.toString(),
        laborPrice: m.laborPrice.toString(),
      }));

      const payload = {
        generalInformation: {
          estimationId: estimateId,
        },
        material: materialPayload,
        isFinished: isFinished,
      };

      const res = await fetch(`/api/construction/estimates/${estimateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Save failed");
      }

      const json = await res.json();
      if (!res.ok) {
        CallToast({
          title: "Thất bại",
          message: json?.message || "Lưu vật tư thất bại",
          color: "danger",
        });
        return;
      }
      setEstimateData(json.data);

      CallToast({
        title: "Thành công",
        message: isFinished ? "Hoàn thành dự toán" : "Lưu nháp thành công",
        color: "success",
      });
    } catch (err) {
      CallToast({
        title: "Thất bại",
        message: "Có lỗi xảy ra khi lưu vật tư",
        color: "danger",
      });
    }
  };

  const handleChange = (
    id: string,
    field: keyof MaterialEstimateItem,
    value: any,
  ) => {
    setMaterials((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        updated.materialTotal = updated.quantity * updated.materialPrice;
        updated.laborTotal = updated.quantity * updated.laborPrice;

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
            onChange={(e) =>
              handleChange(item.id, "quantity", Number(e.target.value))
            }
            size="sm"
            type="number"
            step="0.01"
          />
        );
      case "materialPrice":
        return (
          <Input
            value={String(item.materialPrice || "")}
            onChange={(e) =>
              handleChange(item.id, "materialPrice", Number(e.target.value))
            }
            size="sm"
            type="number"
            step="1000"
          />
        );
      case "laborPrice":
        return (
          <Input
            value={String(item.laborPrice || "")}
            onChange={(e) =>
              handleChange(item.id, "laborPrice", Number(e.target.value))
            }
            size="sm"
            type="number"
            step="1000"
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
        title="Chi phí vật tư khách hàng thanh toán"
        topContent={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <SearchInputWithButton
              label="Mã vật tư"
              onSearch={() => setShowMaterialModal(true)}
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

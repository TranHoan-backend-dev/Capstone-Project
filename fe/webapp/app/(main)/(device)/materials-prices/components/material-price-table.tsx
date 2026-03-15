"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tooltip, Button } from "@heroui/react";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";
import {
  MaterialPriceItem,
  MaterialPriceResponse,
  MaterialPriceTableProps,
} from "@/types";
import { MATERIAL_PRICE_COLUMN } from "@/config/table-columns";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";

export const MaterialPriceTable = ({
  filter,
  reloadKey,
  onEdit,
  onDeleted,
}: MaterialPriceTableProps) => {
  const [data, setData] = useState<MaterialPriceItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
          sort: `${sort.field},${sort.direction}`,
          jobContent: filter.jobContent || "%",
          laborCode: filter.laborCode || "%",
        });

        // if (filter.name) params.append("jobContent", filter.name);
        // if (filter.symbol) params.append("laborCode", filter.symbol);
        if (filter.groupId) params.append("groupId", filter.groupId);
        if (filter.minPrice) params.append("minPrice", filter.minPrice);
        if (filter.maxPrice) params.append("maxPrice", filter.maxPrice);
        const res = await fetch(
          `/api/device/materials-prices?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        setTotalItems(pageData?.page?.totalElements ?? 0);
        setTotalPages(pageData?.page?.totalPages ?? 1);

        const mapped = items.map(
          (item: MaterialPriceResponse, index: number) => ({
            id: item.id,
            stt: (page - 1) * pageSize + index + 1,
            laborCode: item.laborCode,
            unitName: item.unitName,
            groupName: item.groupName,
            jobContent: item.jobContent,
            price: item.price,
            laborPrice: item.laborPrice,
            laborPriceAtRuralCommune: item.laborPriceAtRuralCommune,
            constructionMachineryPrice: item.constructionMachineryPrice,
            constructionMachineryPriceAtRuralCommune:
              item.constructionMachineryPriceAtRuralCommune,
          }),
        );
        setData(mapped);
      } catch (e) {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, filter, reloadKey, sort]);

  const handleSortChange = (columnKey: string) => {
    setPage(1);

    setSort((prev) => {
      const direction =
        prev.field === columnKey && prev.direction === "asc" ? "desc" : "asc";

      return {
        field: columnKey === "stt" ? "createdAt" : columnKey,
        direction,
      };
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res = await authFetch(`/api/device/materials-prices/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      CallToast({
        title: "Thành công",
        message: "Xóa đơn giá vật tư thành công",
        color: "success",
      });

      setDeleteId(null);
      onDeleted();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter, reloadKey]);

  const actionItems = useMemo(
    () => [
      {
        content: "Chỉnh sửa",
        icon: EditIcon,
        className:
          "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) onEdit(found);
        },
      },
      {
        content: "Xóa",
        icon: DeleteIcon,
        className: "text-red-500 hover:bg-red-50",
        onClick: (id: string) => {
          setDeleteId(id);
        },
      },
    ],
    [data, onEdit, onDeleted],
  );

  const renderCell = (item: MaterialPriceItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );

      case "laborCode":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.laborCode}
          </span>
        );

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {actionItems.map((action, idx) => (
              <Tooltip key={idx} content={action.content} closeDelay={0}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className={`${action.className} rounded-lg`}
                  onPress={() => action.onClick(item.id)}
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </Tooltip>
            ))}
          </div>
        );
      default:
        return (
          <span className="text-gray-600 dark:text-default-600">
            {item[columnKey as keyof MaterialPriceItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách Đơn giá vật tư"
        columns={MATERIAL_PRICE_COLUMN}
        data={data}
        isCollapsible
        renderCellAction={renderCell}
        headerSummary={`${data.length}`}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${totalItems}`,
        }}
        sort={sort}
        onSortChange={handleSortChange}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá đơn giá vật tư này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

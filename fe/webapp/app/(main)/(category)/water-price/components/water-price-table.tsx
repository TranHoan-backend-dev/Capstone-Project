"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tooltip, Button } from "@heroui/react";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";
import {
  USAGE_TARGET_LABEL,
  WaterPriceItem,
  WaterPriceResponse,
  WaterPriceTableProps,
} from "@/types";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { WATER_PRICE_COLUMN } from "@/config/table-columns";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";

export const WaterPriceTable = ({
  filter,
  reloadKey,
  onEdit,
  onDeleted,
}: WaterPriceTableProps) => {
  const [data, setData] = useState<WaterPriceItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "",
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
        });

        const trimmedFilter = filter.usageTarget?.trim() || "";

        if (trimmedFilter) {
          params.append("filter", trimmedFilter);
        }

        const res = await authFetch(
          `/api/device/water-prices?${params.toString()}`,
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
        const mapped = items.map((item: WaterPriceResponse, index: number) => ({
          id: item.id,
          stt: (page - 1) * pageSize + index + 1,
          usageTarget: item.usageTarget,
          tax: item.tax,
          environmentPrice: item.environmentPrice,
          applicationPeriod: item.applicationPeriod,
          expirationDate: item.expirationDate,
          description: item.description,
        }));
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

      const fieldMap: Record<string, string> = {
        stt: "createdAt",
        usageTarget: "usageTarget",
        tax: "tax",
        environmentPrice: "environmentPrice",
        applicationPeriod: "applicationPeriod",
        expirationDate: "expirationDate",
      };

      return {
        field: fieldMap[columnKey] || "createdAt",
        direction,
      };
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res = await authFetch(`/api/device/water-prices/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      CallToast({
        title: "Thành công",
        message: "Xóa giá nước thành công",
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
  }, [filter]);

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
    [data, onEdit],
  );

  const renderCell = (item: WaterPriceItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );
      case "usageTarget":
        return (
          <span className="text-gray-600 dark:text-default-600">
            {USAGE_TARGET_LABEL[item.usageTarget] || item.usageTarget}
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
            {item[columnKey as keyof WaterPriceItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách Giá nước"
        columns={WATER_PRICE_COLUMN}
        data={data}
        isCollapsible
        renderCellAction={renderCell}
        headerSummary={`${totalItems}`}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
        sort={sort}
        onSortChange={handleSortChange}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá giá nước này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tooltip, Button } from "@heroui/react";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { WATER_METER_COLUMN } from "@/config/table-columns";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";
import {
  WaterMeterItem,
  WaterMeterResponse,
  WaterMeterTableProps,
} from "@/types";

export const WaterMeterTable = ({
  filter,
  reloadKey,
  onEdit,
  onDeleted,
}: WaterMeterTableProps) => {
  const [data, setData] = useState<WaterMeterItem[]>([]);
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
        });

        Object.entries(filter || {}).forEach(([key, value]) => {
          if (value?.toString().trim()) {
            const paramKey = key === "size" ? "meterSize" : key;
            params.append(paramKey, value.toString().trim());
          }
        });

        const res = await authFetch(
          `/api/device/water-meter-type?${params.toString()}`,
        );

        if (!res.ok) {
          CallToast({
            title: "Lỗi",
            message: "Không thể tải danh sách loại đồng hồ nước",
            color: "danger",
          });
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        setTotalItems(pageData?.totalElements ?? 0);
        setTotalPages(pageData?.totalPages ?? 1);

        const mapped = items.map((item: WaterMeterResponse, index: number) => ({
          id: item.typeId,
          stt: (page - 1) * pageSize + index + 1,
          name: item.name,
          meterModel: item.meterModel,
          origin: item.origin,
          maxIndex: item.maxIndex,
          diameter: item.diameter,
          size: item.size,
          qn: item.qn,
          qt: item.qt,
          qmin: item.qmin,
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

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res = await authFetch(`/api/device/water-meter-type/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const serverMessage: string = errorJson?.message ?? "";
        let displayMessage = "Có lỗi xảy ra khi xóa loại đồng hồ nước";

        if (serverMessage.includes("has water meters that are in use")) {
          displayMessage =
            "Không thể xóa loại đồng hồ nước này vì đang có đồng hồ nước đang sử dụng";
        }

        CallToast({
          title: "Lỗi",
          message: displayMessage,
          color: "danger",
        });
        return;
      }

      CallToast({
        title: "Thành công",
        message: "Xóa loại đồng hồ nước thành công",
        color: "success",
      });

      setDeleteId(null);
      onDeleted();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi xóa loại đồng hồ nước",
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

  const renderCell = (item: WaterMeterItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );

      case "name":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.name}
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
            {item[columnKey as keyof WaterMeterItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách Loại đồng hồ nước"
        columns={WATER_METER_COLUMN}
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
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá loại đồng hồ nước này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

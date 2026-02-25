"use client";

import { Button, Chip, Tooltip } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DarkGreenChip,
  DarkRedChip,
  DeleteIcon,
  EditIcon,
} from "@/config/chip-and-icon";
import {
  BusinessPageItem,
  BusinessPageResponse,
  BusinessPageTableProps,
} from "@/types";
import { BUSINESS_PAGES_COLUMNS } from "@/config/table-columns";

export const BusinessPageTable = ({
  filter,
  isActive,
  reloadKey,
  onEdit,
  onDelete,
}: BusinessPageTableProps) => {
  const [data, setData] = useState<BusinessPageItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editingItem, setEditingItem] = useState<BusinessPageItem | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
        });

        const trimmedKeyword = filter.trim();
        if (trimmedKeyword) {
          params.append("filter", trimmedKeyword);
        }

        if (isActive !== undefined && isActive !== null) {
          params.append("isActive", String(isActive));
        }
        const res = await fetch(
          `/api/organization/business-pages?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.items ?? [];
        setTotalItems(pageData?.totalItems ?? 0);
        setTotalPages(pageData?.totalPages ?? 1);

        const mapped = items.map(
          (item: BusinessPageResponse, index: number) => ({
            id: item.pageId,
            stt: (page - 1) * pageSize + index + 1,
            name: item.name,
            status: item.activate,
            creator: item.creator,
            updator: item.updator,
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
  }, [page, filter, isActive, reloadKey]);

  useEffect(() => {
    setPage(1);
  }, [filter, isActive]);

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
        onClick: async (id: string) => {
          if (!confirm("Bạn có chắc muốn xóa trang này?")) return;

          try {
            const res = await fetch(`/api///${id}`, {
              method: "DELETE",
            });

            if (!res.ok) throw new Error("Delete failed");

            onDelete();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ],
    [data, onEdit, onDelete],
  );

  const renderCell = (item: BusinessPageItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span>{item.stt}</span>;

      case "name":
        return <span className="font-semibold">{item.name}</span>;

      case "status": {
        const isActive = item.status;
        if (isActive) {
          return (
            <Chip
              className={DarkGreenChip}
              color="success"
              size="sm"
              variant="flat"
            >
              Hoạt động
            </Chip>
          );
        }
        return (
          <Chip className={DarkRedChip} color="danger" size="sm" variant="flat">
            Không hoạt động
          </Chip>
        );
      }

      case "creator":
        return <span className="text-gray-700">{item.creator}</span>;

      case "updator":
        return <span className="text-gray-700">{item.updator}</span>;

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
        return (item as any)[columnKey];
    }
  };

  return (
    <GenericDataTable
      isLoading={loading}
      title="Danh sách trang doanh nghiệp"
      columns={BUSINESS_PAGES_COLUMNS}
      data={data}
      isCollapsible
      renderCellAction={renderCell}
      headerSummary={`${totalItems}`}
      paginationProps={{
        total: totalPages,
        initialPage: page,
        onChange: setPage,
        summary: `${data.length}`,
      }}
    />
  );
};

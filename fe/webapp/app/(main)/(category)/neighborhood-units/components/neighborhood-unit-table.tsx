"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tooltip, Button } from "@heroui/react";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { NEIGHBORHOOD_UNIT_COLUMN } from "@/config/table-columns";
import { NeighborhoodTableProps, NeighborhoodUnitItem, NeighborhoodUnitResponse } from "@/types";

export const NeighborhoodUnitTable = ({
  filter,
  reloadKey,
  onEdit,
  onDeleted,
}: NeighborhoodTableProps) => {
  const [data, setData] = useState<NeighborhoodUnitItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
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

        const res = await fetch(
          `/api/construction/neighborhood-units?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        setTotalItems(pageData?.totalElements ?? 0);
        setTotalPages(pageData?.totalPages ?? 1);

        const mapped = items.map(
          (item: NeighborhoodUnitResponse, index: number) => ({
            id: item.unitId,
            stt: (page - 1) * pageSize + index + 1,
            name: item.name,
            communeId: item.communeId,
            communeName: item.communeName,
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
        onClick: async (id: string) => {
          if (!confirm("Bạn có chắc muốn xóa phường/xã này?")) return;

          try {
            const res = await fetch(
              `/api/construction/neighborhood-units/${id}`,
              {
                method: "DELETE",
              },
            );

            if (!res.ok) throw new Error("Delete failed");

            onDeleted();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ],
    [data, onEdit, onDeleted],
  );

  const renderCell = (item: NeighborhoodUnitItem, columnKey: string) => {
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
            {item[columnKey as keyof NeighborhoodUnitItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách Tổ/khu phố"
        columns={NEIGHBORHOOD_UNIT_COLUMN}
        data={data}
        isCollapsible
        renderCellAction={renderCell}
        headerSummary={`${totalItems}`}
        paginationProps={{
          total: totalPages,
          initialPage: page,
          onChange: setPage,
          summary: `${totalItems}`,
        }}
        sort={sort}
        onSortChange={handleSortChange}
      />
    </>
  );
};

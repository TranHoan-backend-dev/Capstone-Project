"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tooltip, Button } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";
import { NetworksItem } from "@/types";
import { NETWORKS_COLUMN } from "@/config/table-columns";

interface Props {
  keyword: string;
}

interface NetworkResponse {
  branchId: string;
  name: string;
}

export const NetworksTable = ({ keyword }: Props) => {
  const [data, setData] = useState<NetworksItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);

    const currentPage = keyword ? 1 : page;
    if (keyword && page !== 1) {
      setPage(1);
      return;
    }

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(currentPage - 1),
          size: String(pageSize),
        });

        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword) {
          params.append("keyword", trimmedKeyword);
        }

        const res = await fetch(
          `/api/construction/networks?${params.toString()}`,
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

        const mapped = items.map((item: NetworkResponse, index: number) => ({
          id: item.branchId,
          stt: (currentPage - 1) * pageSize + index + 1,
          name: item.name,
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
  }, [page, keyword]);

  const actionItems = useMemo(
    () => [
      {
        content: "Chỉnh sửa",
        icon: EditIcon,
        className:
          "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
        onClick: (id: string) => console.log("Cập nhật:", id),
      },
      {
        content: "Xóa",
        icon: DeleteIcon,
        className: "text-red-500 hover:bg-red-50",
        onClick: (id: string) => console.log("Xóa:", id),
      },
    ],
    [],
  );

  const renderCell = (item: NetworksItem, columnKey: string) => {
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
            {item[columnKey as keyof NetworksItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách chi nhánh cấp nước"
        columns={NETWORKS_COLUMN}
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
      />
    </>
  );
};

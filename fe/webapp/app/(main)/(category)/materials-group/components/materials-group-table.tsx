"use client";

import React, { useState, useEffect } from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { CalculatorIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { MaterialGroupItem } from "@/types";
import { MATERIALS_GROUP_COLUMN } from "@/config/table-columns";

export const MaterialsGroupTable = () => {
  const [data, setData] = useState<MaterialGroupItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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

        const res = await fetch(`/api/device/materials-group?${params.toString()}`);

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        const pageInfo = pageData?.page;
        setTotalItems(pageInfo?.totalElements ?? 0);

        const mapped = items.map((item: any, index: number) => ({
          id: item.id,
          stt: (page - 1) * pageSize + index + 1,
          code: item.username,
          name: item.fullname,
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
  }, [page]);

  const actions = [
    {
      content: "Xóa",
      icon: CalculatorIcon,
      className:
        "text-blue-600 dark:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30",
    },
    {
      content: "Chỉnh sửa",
      icon: PencilSquareIcon,
      className:
        "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
    },
  ];
  const renderCell = (item: MaterialGroupItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="font-medium text-black dark:text-white"></span>;
      case "code":
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href="#"
          >
            {item.code}
          </Link>
        );
      case "name":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground"></span>
        );

      case "actions":
        return (
          <div className="flex justify-center items-center gap-1">
            {actions.map((action, idx) => (
              <Tooltip
                key={idx}
                closeDelay={0}
                color={idx % 2 == 0 ? "primary" : "warning"}
                content={action.content}
              ></Tooltip>
            ))}
          </div>
        );
      default:
        return (
          <span className="text-gray-600 dark:text-default-600">
            {item[columnKey as keyof MaterialGroupItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isCollapsible
        columns={MATERIALS_GROUP_COLUMN}
        data={data}
        headerSummary={`${data.length}`}
        paginationProps={{
          total: 5,
          initialPage: 1,
          summary: `1-5 của 25`,
        }}
        renderCellAction={renderCell}
        title="Quản lý nhóm vật tư"
      />
    </>
  );
};

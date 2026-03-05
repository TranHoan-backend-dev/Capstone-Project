"use client";

import React, { useState, useEffect } from "react";
import { Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  BlueYellowIconColor,
  DeleteIcon,
  PrintReceiptIcon,
  RedIconColor,
  TitleDarkColor,
} from "@/config/chip-and-icon";
import { INSTALLATION_FORM_NEW_COLUMN } from "@/config/table-columns";
import { NewInstallationFormItem, NewInstallationFormResponse } from "@/types";
import { formatDate } from "@/utils/format";

interface Props {
  keyword: string;
  reloadKey: number;
}

export const RelatedOrdersTable = ({ keyword, reloadKey }: Props) => {
  const [data, setData] = useState<NewInstallationFormItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
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

        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword) {
          params.append("keyword", trimmedKeyword);
        }

        const res = await fetch(
          `/api/construction/installation-forms?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        setTotalItems(pageData?.page.totalElements ?? 0);
        setTotalPages(pageData?.page.totalPages ?? 1);

        const mapped = items.map(
          (item: NewInstallationFormResponse, index: number) => ({
            id: item.formCode,
            stt: (page - 1) * pageSize + index + 1,
            formNumber: item.formNumber,
            customerName: item.customerName,
            phoneNumber: item.phoneNumber,
            address: item.address,
            registrationAt: formatDate(item.registrationAt),
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
  }, [page, keyword, reloadKey, sort]);

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

  const actionButtons = [
    {
      content: "In biên nhận",
      icon: PrintReceiptIcon,
      className: BlueYellowIconColor,
      color: "primary" as const,
    },
    {
      content: "Xóa",
      icon: DeleteIcon,
      className: RedIconColor,
      color: "danger" as const,
    },
  ];
  
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );
      case "formNumber":
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href="#"
          >
            {item.formNumber}
          </Link>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2 justify-center">
            {actionButtons.map((action, idx) => (
              <Tooltip
                key={idx}
                closeDelay={0}
                color={action.color}
                content={action.content}
              >
                <Button
                  isIconOnly
                  className={action.className}
                  size="sm"
                  variant="light"
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </Tooltip>
            ))}
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <GenericDataTable
      isCollapsible
      columns={INSTALLATION_FORM_NEW_COLUMN}
      data={data}
      headerSummary={`${totalItems}`}
      paginationProps={{
        total: totalPages,
        page: page,
        onChange: setPage,
        summary: `${totalItems}`,
      }}
      renderCellAction={renderCell}
      title="Danh sách đơn lắp đặt mới"
      sort={sort}
      onSortChange={handleSortChange}
    />
  );
};

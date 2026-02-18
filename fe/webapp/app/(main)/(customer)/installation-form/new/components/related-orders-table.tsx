"use client";

import React, { useState, useEffect } from "react";
import { Link, Chip, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  BlueYellowIconColor,
  DarkGreenChip,
  DarkYellowChip,
  DeleteIcon,
  PrintReceiptIcon,
  RedIconColor,
  TitleDarkColor,
} from "@/config/chip-and-icon";
import { INSTALLATION_FORM_NEW_COLUMN } from "@/config/table-columns";
import { InstallationFormNewItem } from "@/types";
import { formatDate } from "@/utils/format";

interface Props {
  keyword: string;
  reloadKey: number;
}

interface InstallationFormNewResponse {
  formCode: string;
  formNumber: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  registrationAt: string;
  surveyEmployeeName: string;
  status: {
    registration: string;
  };
}

export const RelatedOrdersTable = ({ keyword, reloadKey }: Props) => {
  const [data, setData] = useState<InstallationFormNewItem[]>([]);
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
        setTotalItems(pageData?.totalElements ?? 0);
        setTotalPages(pageData?.totalPages ?? 1);

        const mapped = items.map(
          (item: InstallationFormNewResponse, index: number) => ({
            id: item.formCode,
            stt: (page - 1) * pageSize + index + 1,
            code: item.formNumber,
            customerName: item.customerName,
            phone: item.phoneNumber,
            address: item.address,
            createdDate: formatDate(item.registrationAt),
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

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );
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
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );
      case "status":
        if (item.status === "completed") {
          return (
            <Chip
              className={`font-bold ${DarkGreenChip}`}
              color="success"
              size="sm"
              variant="flat"
            >
              Hoàn thành
            </Chip>
          );
        }

        return (
          <Chip
            className={`font-bold ${DarkYellowChip}`}
            color="warning"
            size="sm"
            variant="flat"
          >
            Đang lắp đặt
          </Chip>
        );
      case "actions":
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
        initialPage: page,
        onChange: setPage,
        summary: `${totalItems}`,
      }}
      renderCellAction={renderCell}
      title="Danh sách đơn liên quan"
    />
  );
};

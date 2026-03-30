"use client";

import { Button, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";

import { StatusBar } from "./status-bar";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DeleteIcon,
  RedIconColor,
  TitleDarkColor,
} from "@/config/chip-and-icon";
import {
  NewInstallationLookupItem,
  NewInstallationLookupResponse,
} from "@/types";
import { NEW_INSTALLATION_LOOKUP_COLUMN } from "@/config/table-columns";
import { authFetch } from "@/utils/authFetch";
import { formatDate1 } from "@/utils/format";

interface ResultsTableProps {
  keyword?: string;
  reloadKey?: number;
  from?: string | null;
  to?: string | null;
}

export const RelatedOrdersTable = ({
  keyword,
  reloadKey,
  from,
  to,
}: ResultsTableProps) => {
  const [data, setData] = useState<NewInstallationLookupItem[]>([]);
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
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (keyword) params.append("keyword", keyword);

        const res = await authFetch(
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
          (item: NewInstallationLookupResponse, index: number) => {
            const { stage, status } = getStageAndStatus(item.status);
            return {
              id: item.formCode,
              stt: (page - 1) * pageSize + index + 1,
              formNumber: item.formNumber,
              customerName: item.customerName,
              registrationAt: formatDate1(item.registrationAt),
              address: item.address,
              stage: stage.toLowerCase(),
              status: status?.toLowerCase() ?? "pending",
            };
          },
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
  }, [page, keyword, reloadKey, sort, from, to]);

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
      content: "Xóa",
      icon: DeleteIcon,
      className: RedIconColor,
      color: "danger" as const,
    },
  ];

  const mapStatus = (status: string) => {
    switch (status) {
      case "PENDING_FOR_APPROVAL":
        return "pending";
      case "PROCESSING":
        return "processing";
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      default:
        return "pending";
    }
  };

  const getStageAndStatus = (statusObj: any) => {
    if (!statusObj) {
      return { stage: "registration", status: "pending" };
    }

    if (statusObj.registration !== "APPROVED") {
      return {
        stage: "registration",
        status: mapStatus(statusObj.registration),
      };
    }

    if (statusObj.estimate !== "APPROVED") {
      return {
        stage: "estimate",
        status: mapStatus(statusObj.estimate),
      };
    }

    if (statusObj.contract !== "APPROVED") {
      return {
        stage: "contract",
        status: mapStatus(statusObj.contract),
      };
    }

    if (statusObj.construction !== "APPROVED") {
      return {
        stage: "construction",
        status: mapStatus(statusObj.construction),
      };
    }

    return {
      stage: "construction",
      status: "approved",
    };
  };

  useEffect(() => {
    setPage(1);
  }, [keyword, from, to]);

  const renderCell = (item: any, key: string) => {
    switch (key) {
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
      case "status":
        return <StatusBar stage={item.stage} status={item.status} />;
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
                  className={`${action.className} bg-transparent data-[hover=true]:bg-transparent`}
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
        return item[key];
    }
  };

  return (
    <GenericDataTable
      isLoading={loading}
      title="Danh sách đơn"
      columns={NEW_INSTALLATION_LOOKUP_COLUMN}
      isCollapsible
      data={data}
      renderCellAction={renderCell}
      headerSummary={`${totalItems}`}
      paginationProps={{
        total: totalPages,
        page: page,
        onChange: setPage,
        summary: `${data.length}`,
      }}
      onSortChange={handleSortChange}
    />
  );
};

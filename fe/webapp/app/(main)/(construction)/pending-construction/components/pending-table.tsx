"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { CancelIcon, CheckApprovalIcon } from "@/config/chip-and-icon";
import { PENDING_CONSTRUCTION } from "@/config/table-columns/construction/pending-construction-column";
import { authFetch } from "@/utils/authFetch";
import {
  FilterPendingConstructionRequest,
  PendingConstructionItem,
  PendingConstructionResponse,
} from "@/types";

interface PendingTableProps {
  filters?: FilterPendingConstructionRequest;
  onApprove?: (id: string, formCode: string, formNumber: string) => void;
  onReject?: (id: string) => void;
  refreshTrigger?: number;
}

export const PendingTable = ({
  filters,
  onApprove,
  onReject,
  refreshTrigger = 0,
}: PendingTableProps) => {
  const [data, setData] = useState<PendingConstructionItem[]>([]);
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

        const res = await authFetch(`/api/construction/constructions`);

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
          (item: PendingConstructionResponse, index: number) => ({
            id: item.formCode,
            stt: (page - 1) * pageSize + index + 1,
            formNumber: item.formNumber,
            customerName: item.customerName,
            phoneNumber: item.phoneNumber,
            handoverByFullName: item.handoverByFullName,
            address: item.address,
            scheduleSurveyAt: item.scheduleSurveyAt,
            status: item.status.construction,
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
  }, [page, sort]);
  const actionItems = [
    {
      content: "Duyệt đơn",
      icon: CheckApprovalIcon,
      color: "success" as const,
      className: "text-green-600 hover:bg-green-50",
      onClick: (id: string) => console.log("Duyệt:", id),
    },
    {
      content: "Từ chối đơn",
      icon: CancelIcon,
      color: "danger" as const,
      className: "text-red-500 hover:bg-red-50",
      onClick: (id: string) => console.log("Từ chối:", id),
    },
  ];

  const renderCell = (item: PendingConstructionItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="font-medium text-blue-600">{item.stt}</span>;

      case "formNumber":
        return <span className="font-semibold">{item.formNumber}</span>;

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {actionItems.map((action, idx) => (
              <Tooltip
                key={idx}
                content={action.content}
                closeDelay={0}
                color={action.color}
              >
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
      title="Danh sách đơn chờ"
      columns={PENDING_CONSTRUCTION}
      data={data}
      isCollapsible
      headerSummary={`${data.length}`}
      renderCellAction={renderCell}
      paginationProps={{
        total: totalPages,
        page: page,
        onChange: setPage,
        summary: `${data.length}`,
      }}
    />
  );
};

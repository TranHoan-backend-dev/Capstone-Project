"use client";

import React, { useState, useEffect } from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { EstimateDetailModal } from "./estimate-detail-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DarkGreenChip,
  DarkRedChip,
  EstimationIcon,
  GreenIconColor,
  TitleDarkColor,
} from "@/config/chip-and-icon";
import { EstimateItem, EstimateResponse, EstimateStatus } from "@/types";
import { ESTIMATE_PREPARATION_COLUMN } from "@/config/table-columns";
import { formatDate } from "@/utils/format";

interface ResultsTableProps {
  keyword?: string;
  from?: string | null;
  to?: string | null;
}

const statusMap: Record<
  EstimateStatus,
  { label: string; color: any; bg: string }
> = {
  PENDING_FOR_APPROVAL: {
    label: "Chờ lập dự toán",
    color: "warning",
    bg: DarkGreenChip,
  },
  APPROVED: {
    label: "Đã duyệt",
    color: "success",
    bg: DarkGreenChip,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "primary",
    bg: DarkGreenChip,
  },
  REJECTED: {
    label: "Bị từ chối",
    color: "danger",
    bg: DarkRedChip,
  },
};

export const ResultsTable = ({ keyword, from, to }: ResultsTableProps) => {
  const baseStyle = "text-gray-500 dark:text-white";
  const [selectedEstimate, setSelectedEstimate] = useState<EstimateItem | null>(
    null,
  );

  const [data, setData] = useState<EstimateItem[]>([]);
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

  const mapEstimateToModalData = (item: EstimateItem) => {
    return {
      code: item.formNumber,
      address: item.address,
      registerDate: item.registerDate,
      status: item.status,
      creator: "Chưa có",
      createDate: item.registerDate,
      approver: "Chưa có",
      approveDate: "",
      totalPrice: 0,
      note: "",
    };
  };

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

        const res = await fetch(
          `/api/construction/estimates?${params.toString()}`,
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
        const mapped: EstimateItem[] = items.map((item: any) => {
          const info = item.generalInformation;

          return {
            id: info.estimationId,
            formCode: info.installationFormId?.formCode,
            formNumber: info.installationFormId?.formNumber,
            note: info.note,
            customerName: info.customerName,
            address: info.address,
            registerDate: new Date(info.createdAt).toLocaleDateString("vi-VN"),
            status: info.status.estimate,
          };
        });

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
  }, [page, sort, keyword, from, to]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusClick = (item: EstimateItem) => {
    setSelectedEstimate(item);
    setIsModalOpen(true);
  };

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
  }, [keyword, from, to]);
  const router = useRouter();

  const handleRunEstimate = (item: EstimateItem) => {
    router.push(`/estimate/run/${item.id}`);
  };
  const renderCell = (item: EstimateItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      case "formNumber":
        return (
          <button
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            onClick={() => handleStatusClick(item)}
          >
            {item.formNumber}
          </button>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-white">
            {item.customerName}
          </span>
        );
      case "address":
        return <span className={`${baseStyle}`}>{item.address}</span>;
      case "registerDate":
        return <span className={`${baseStyle}`}>{item.registerDate}</span>;
      case "status":
        const config = statusMap[item.status as EstimateStatus];

        return (
          <Chip
            className={`${config?.bg}`}
            color={config?.color}
            size="sm"
            variant="flat"
          >
            {config?.label}
          </Chip>
        );
      case "actions":
        return (
          <Tooltip closeDelay={0} color="success" content="Chạy dự toán">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => handleRunEstimate(item)}
            >
              <EstimationIcon className={GreenIconColor} />
            </Button>
          </Tooltip>
        );
      default:
        return (item as any)[columnKey];
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách lập dự toán"
        columns={ESTIMATE_PREPARATION_COLUMN}
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
        onSortChange={handleSortChange}
      />
      <EstimateDetailModal
        data={
          selectedEstimate
            ? mapEstimateToModalData(selectedEstimate)
            : undefined
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

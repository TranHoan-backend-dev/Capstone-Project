"use client";

import { Button, Tooltip, Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DeleteIcon,
  ViewIcon,
  CheckApprovalIcon,
} from "@/config/chip-and-icon";
import { authFetch } from "@/utils/authFetch";
import { PendingConstructionItem, PendingConstructionResponse } from "@/types";
import { PENDING_CONSTRUCTION } from "@/config/table-columns/construction/pending-construction-column";

interface ApprovedRecord extends PendingConstructionItem {
  contractNo?: string;
  constructionStatus?: string;
}

interface ApprovedTableProps {
  refreshTrigger?: number;
  onApprove?: () => void;
}

export const ApprovedTable = ({
  refreshTrigger = 0,
  onApprove,
}: ApprovedTableProps) => {
  const [data, setData] = useState<ApprovedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const pageSize = 10;

  const columns = [
    { key: "formCode", label: "Mã đơn" },
    { key: "contractNo", label: "Số hợp đồng" },
    { key: "customerName", label: "Tên công trình" },
    { key: "phoneNumber", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "constructedByFullName", label: "Nhân viên thi công" },
    { key: "registrationAt", label: "Ngày đăng ký" },
    { key: "actions", label: "Hành động", align: "center" as const },
  ];

  useEffect(() => {
    fetchApprovedData();
  }, [page, refreshTrigger]);

  const fetchApprovedData = async () => {
    setLoading(true);
    try {
      const res = await authFetch(
        `/api/construction/constructions?page=${page - 1}&size=${pageSize}&status=PENDING_FOR_APPROVED`,
      );

      if (!res.ok) {
        console.error("Failed to fetch approved data");
        return;
      }

      const json = await res.json();
      const pageData = json?.data;
      const items = pageData?.content ?? [];
      setTotalItems(pageData?.page.totalElements ?? 0);
      setTotalPages(pageData?.page.totalPages ?? 1);

      const mapped = items.map(
        (
          item: PendingConstructionResponse & {
            constructedByFullName?: string;
          },
          index: number,
        ) => ({
          id: item.formCode,
          stt: (page - 1) * pageSize + index + 1,
          formCode: item.formCode,
          formNumber: item.formNumber,
          customerName: item.customerName,
          phoneNumber: item.phoneNumber,
          address: item.address,
          registrationAt: item.registrationAt,
          constructedByFullName: item.constructedByFullName || "Chưa phân công",
          status: item.status.construction,
        }),
      );

      setData(mapped);
    } catch (error) {
      console.error("Error fetching approved data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: ApprovedRecord) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn duyệt đơn thi công cho công trình "${item.customerName}"?`,
      )
    ) {
      return;
    }

    setApprovingId(item.id);
    try {
      const response = await authFetch(
        `/api/construction/review/${item.id}/true`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        await fetchApprovedData();
        if (onApprove) {
          onApprove();
        }
        // Có thể thêm toast notification ở đây
        console.log("Duyệt đơn thành công");
      } else {
        const errorData = await response.json();
        console.error("Failed to approve:", errorData);
        alert(errorData?.message || "Duyệt đơn thất bại");
      }
    } catch (error) {
      console.error("Error approving:", error);
      alert("Có lỗi xảy ra khi duyệt đơn");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn này?")) return;

    try {
      const response = await authFetch(`/api/construction/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchApprovedData();
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleViewDetails = (item: ApprovedRecord) => {
    console.log("View details:", item);
  };

  const renderCell = (item: ApprovedRecord, columnKey: string) => {
    switch (columnKey) {
      case "formCode":
        return (
          <span className="font-medium text-blue-600">{item.formCode}</span>
        );

      case "customerName":
        return <span className="font-semibold">{item.customerName}</span>;

      case "constructedByFullName":
        return (
          <span
            className={
              item.constructedByFullName === "Chưa phân công"
                ? "text-orange-500"
                : "text-green-600"
            }
          >
            {item.constructedByFullName}
          </span>
        );

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Xem chi tiết" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-blue-500 hover:bg-blue-50 rounded-lg"
                onPress={() => handleViewDetails(item)}
              >
                <ViewIcon className="w-5 h-5" />
              </Button>
            </Tooltip>

            <Tooltip content="Duyệt đơn" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-green-600 hover:bg-green-50 rounded-lg"
                onPress={() => handleApprove(item)}
                isLoading={approvingId === item.id}
                isDisabled={approvingId === item.id}
              >
                <CheckApprovalIcon className="w-5 h-5" />
              </Button>
            </Tooltip>

            <Tooltip content="Xóa" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-red-500 hover:bg-red-50 rounded-lg"
                onPress={() => handleDelete(item.formCode)}
              >
                <DeleteIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return (item as any)[columnKey];
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <GenericDataTable
      title="Danh sách đơn chờ duyệt thi công"
      columns={columns}
      data={data}
      isCollapsible
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

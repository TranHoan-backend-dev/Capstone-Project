"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Chip, Link, Tooltip, Button, Spinner } from "@heroui/react";
import {
  CalculatorIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { SettlementDetailModal } from "./settlement-detail-modal";
import { SettlementDocumentModal } from "./settlement-document-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DarkGreenChip,
  DarkRedChip,
  DarkYellowChip,
  DeleteIcon,
  EditIcon,
  TitleDarkColor,
} from "@/config/chip-and-icon";
import {
  SettlementItem,
  SettlementDetail,
  SettlementResponse,
  SettlementTableProps,
} from "@/types";
import { authFetch } from "@/utils/authFetch";
import { SETLEMENT_LOOKUP_COLUMN } from "@/config/table-columns";
import { CallToast } from "@/components/ui/CallToast";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";

// const statusMap = {
//   APPROVED: {
//     label: "Đã duyệt quyết toán",
//     color: "success" as const,
//     bg: DarkGreenChip,
//   },
//   REJECTED: {
//     label: "Lập lại quyết toán",
//     color: "danger" as const,
//     bg: DarkRedChip,
//   },
//   PENDING_FOR_APPROVAL: {
//     label: "Đang xử lý",
//     color: "default" as const,
//     bg: "bg-blue-100 text-blue-800",
//   },
//   PROCESSING: {
//     label: "Chờ duyệt",
//     color: "warning" as const,
//     bg: DarkYellowChip,
//   },
// };
interface ResultsTableProps {
  keyword?: string;
  reloadKey?: number;
  from?: string | null;
  to?: string | null;
  // status?: string;
  onEdit: (item: SettlementItem) => void;
  onDeleted: () => void;
}
export const ResultsTable = ({
  keyword,
  reloadKey,
  from,
  to,
  onEdit,
  onDeleted,
}: ResultsTableProps) => {
  const [data, setData] = useState<SettlementItem[]>([]);
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
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [initialFeeData, setInitialFeeData] = useState<{
    formCode: string;
    formNumber: string;
  } | null>(null);
  // State cho SettlementDetailModal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSettlementDetail, setSelectedSettlementDetail] = useState<
    SettlementDetail | undefined
  >();
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();

  // Fetch data khi filter thay đổi
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
          // sort: `${sort.field},${sort.direction}`,
        });
        if (keyword?.trim()) {
          params.append("keyword", keyword.trim());
        }

        if (from) {
          params.append("fromDate", from);
        }

        if (to) {
          params.append("toDate", to);
        }

        // if (status) {
        //   params.append("status", status);
        // }
        const res = await authFetch(
          `/api/construction/settlements?${params.toString()}`,
        );
        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }
        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        const totalElements = pageData?.totalElements ?? 0;
        const totalPagesValue = pageData?.totalPages ?? 1;
        setTotalItems(totalElements);
        setTotalPages(totalPagesValue || 1);

        if (page > totalPagesValue && totalPagesValue > 0) {
          setPage(totalPagesValue);
          return;
        }

        const mapped = items.map((item: SettlementResponse, index: number) => ({
          id: item.settlementId,
          stt: (page - 1) * pageSize + index + 1,
          formNumber: item.formNumber,
          jobContent: item.jobContent,
          address: item.address,
          registrationAt: item.registrationAt,
          connectionFee: item.connectionFee,
          note: item.note,
          status: item.status,
          formCode: item.formCode,
        }));
        setData(mapped);
      } catch (error: any) {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, keyword, reloadKey, sort, from, to]);

  // Hàm fetch chi tiết quyết toán
  const fetchSettlementDetail = async (settlementId: string) => {
    try {
      setIsDetailLoading(true);
      const res = await authFetch(
        `/api/construction/settlements/${settlementId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch settlement detail");
      }

      const json = await res.json();
      setSelectedSettlementDetail(json?.data);
      setIsDetailModalOpen(true);
    } catch (error: any) {
      CallToast({
        title: "Lỗi",
        message: error.message || "Không thể tải thông tin chi tiết",
        color: "danger",
      });
    } finally {
      setIsDetailLoading(false);
    }
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

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);

      const res = await authFetch(`/api/construction/settlements/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      CallToast({
        title: "Thành công",
        message: "Xóa quyết toán thành công",
        color: "success",
      });

      setDeleteId(null);
      onDeleted();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const actionItems = useMemo(() => {
    return [
      // {
      //   content: "Quyết toán",
      //   icon: CalculatorIcon,
      //   className:
      //     "text-blue-600 dark:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30",
      //   onClick: (id: string) => {
      //     // Gọi hàm fetch chi tiết thay vì onEdit
      //     fetchSettlementDetail(id);
      //   },
      // },
      {
        content: "Tạo phiếu thu",
        icon: CalculatorIcon,
        className:
          "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) {
            router.push(
              `/installation-fee-collection?formCode=${found.formCode}&formNumber=${found.formNumber}`,
            );
          }
        },
      },
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
        onClick: (id: string) => {
          setDeleteId(id);
        },
      },
    ];
  }, [data, onEdit]);

  const renderCell = (item: SettlementItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        const index = data.findIndex((d) => d.id === item.id);
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );
      // case "status":
      //   const config = statusMap[item.status as keyof typeof statusMap] || {
      //     label: item.status,
      //     color: "default" as const,
      //     bg: "bg-gray-100",
      //   };
      // case "status":
      //   const config = statusMap[item.status as keyof typeof statusMap] || {
      //     label: item.status,
      //     color: "default" as const,
      //     bg: "bg-gray-100",
      //   };

      //   return (
      //     <button
      //       className="hover:opacity-80 transition-opacity focus:outline-none"
      //       onClick={() => {
      //         onFilterStatus?.(item.status);
      //       }}
      //     >
      //       <Chip
      //         className={`${config.bg}`}
      //         color={config.color}
      //         size="sm"
      //         variant="flat"
      //       >
      //         {config.label}
      //       </Chip>
      //     </button>
      //   );
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
            {item[columnKey as keyof SettlementItem]}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner label="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <>
      <GenericDataTable
        isCollapsible
        columns={SETLEMENT_LOOKUP_COLUMN}
        data={data}
        headerSummary={`${totalItems}`}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
        renderCellAction={renderCell}
        title="Danh sách quyết toán"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá quyết toán này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Settlement Detail Modal */}
      <SettlementDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSettlementDetail(undefined);
        }}
        data={selectedSettlementDetail}
        loading={isDetailLoading}
      />
    </>
  );
};

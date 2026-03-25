"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Chip, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";
import { FEE_COLLECTION_COLUMN } from "@/config/table-columns";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import {
  FeeCollectionItem,
  FeeCollectionResponse,
  FeeTableTableProps,
} from "@/types";
import { formatDate1 } from "@/utils/format";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";
import { ReceiptDetailModal } from "./receipt-detail-modal";

export const FeeTable = ({
  filter,
  reloadKey,
  onEdit,
  onDeleted,
}: FeeTableTableProps) => {
  const [data, setData] = useState<FeeCollectionItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<FeeCollectionItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });
  const [viewItem, setViewItem] = useState<FeeCollectionItem | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Hàm fetch chi tiết
  const fetchReceiptDetail = async (formCode: string, formNumber: string) => {
    try {
      setViewLoading(true);
      const res = await authFetch(
        `/api/construction/receipts/${formCode}/${formNumber}`,
      );

      if (!res.ok) {
        throw new Error("Không thể lấy thông tin chi tiết");
      }

      const data = await res.json();
      setDetailData(data.data);
    } catch (error: any) {
      CallToast({
        title: "Lỗi",
        message: error.message,
        color: "danger",
      });
    } finally {
      setViewLoading(false);
    }
  };

  // Hàm xử lý click vào formNumber
  const handleViewDetail = (item: FeeCollectionItem) => {
    setViewItem(item);
    fetchReceiptDetail(item.formCode, item.formNumber);
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

        if (filter.name?.trim()) {
          params.append("filter", filter.name.trim());
        }

        if (filter.fromDate) params.append("fromDate", filter.fromDate);
        if (filter.toDate) params.append("toDate", filter.toDate);

        if (filter.isPaid !== undefined && filter.isPaid !== null) {
          params.append("isPaid", String(filter.isPaid));
        }
        const res = await authFetch(
          `/api/construction/receipts?${params.toString()}`,
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
          (item: FeeCollectionResponse, index: number) => ({
            id: `${item.formCode}_${item.formNumber}`,
            formCode: item.formCode,
            formNumber: item.formNumber,
            stt: (page - 1) * pageSize + index + 1,
            receiptNumber: item.receiptNumber,
            customerName: item.customerName,
            address: item.address,
            paymentDate: item.paymentDate,
            isPaid: item.isPaid,
            createdAt: formatDate1(item.createdAt),
            attach: item.attach,
            paymentReason: item.paymentReason,
            totalMoneyInDigits: item.totalMoneyInDigits,
            totalMoneyInCharacters: item.totalMoneyInCharacters,
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
  }, [page, sort, reloadKey, filter]);

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
    if (!deleteItem) return;

    try {
      setDeleteLoading(true);

      const res = await authFetch(
        `/api/construction/receipts/${deleteItem.formCode}/${deleteItem.formNumber}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      CallToast({
        title: "Thành công",
        message: "Xóa phiếu thu thành công",
        color: "success",
      });

      setDeleteItem(null);
      onDeleted();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message,
        color: "danger",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const actionItems = useMemo(() => {
    return [
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
          const found = data.find((i) => i.id === id);
          if (found) setDeleteItem(found);
        },
      },
    ];
  }, [data, onEdit]);

  const renderCell = (item: FeeCollectionItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="text-blue-600 font-bold">{item.stt}</span>;
      case "formNumber":
        return (
          <button
            onClick={() => handleViewDetail(item)}
            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer transition-colors"
          >
            {item.formNumber}
          </button>
        );
      case "isPaid":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.isPaid ? "success" : "warning"}
          >
            {item.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
          </Chip>
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
            {item[columnKey as keyof FeeCollectionItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách phiếu thu"
        columns={FEE_COLLECTION_COLUMN}
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

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá phiếu thu này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <ReceiptDetailModal
        isOpen={!!viewItem}
        onClose={() => {
          setViewItem(null);
          setDetailData(null);
        }}
        detailData={detailData}
        isLoading={viewLoading}
        formCode={viewItem?.formCode}
        formNumber={viewItem?.formNumber}
      />
    </>
  );
};

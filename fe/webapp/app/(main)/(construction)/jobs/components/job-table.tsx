"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tooltip, Button } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";
import { JobItem, JobResponse, JobTableProps } from "@/types";
import { JOB_COLUMN } from "@/config/table-columns";
import { CallToast } from "@/components/ui/CallToast";
import { useIsITStaff } from "@/hooks/useHasRole";
import { authFetch } from "@/utils/authFetch";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";

export const JobsTable = ({
  keyword,
  reloadKey,
  onEdit,
  onDeleted,
}: JobTableProps) => {
  const { isITStaff } = useIsITStaff();
  const [data, setData] = useState<JobItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "name",
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

        if (keyword.name?.trim()) {
          params.append("name", keyword.name.trim());
        }

        if (keyword.fromDate) {
          params.append("fromDate", keyword.fromDate);
        }

        if (keyword.toDate) {
          params.append("toDate", keyword.toDate);
        }

        const res = await authFetch(`/api/organization/jobs?${params.toString()}`);

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.items ?? [];
        setTotalItems(pageData?.totalElements ?? 0);
        setTotalPages(pageData?.totalPages ?? 1);

        const mapped = items.map((item: JobResponse, index: number) => ({
          id: item.jobId,
          stt: (page - 1) * pageSize + index + 1,
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

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res = await authFetch(`/api/organization/jobs/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      CallToast({
        title: "Thành công",
        message: "Xóa công việc thành công",
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
    // Chỉ hiển thị action buttons nếu user là IT_STAFF
    if (!isITStaff) return [];

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
          setDeleteId(id);
        },
      },
    ];
  }, [data, onEdit, isITStaff]);

  const renderCell = (item: JobItem, columnKey: string) => {
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
            {item[columnKey as keyof JobItem]}
          </span>
        );
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách công việc cấp nước"
        columns={JOB_COLUMN}
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
        isOpen={!!deleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá công việc này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

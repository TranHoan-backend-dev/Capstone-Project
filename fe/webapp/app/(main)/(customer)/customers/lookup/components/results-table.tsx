"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Chip, Link, Tooltip, Button, useDisclosure } from "@heroui/react";
import NextLink from "next/link";

import { PriceApplicationModal } from "./price-application-modal";
import { MeterChangeHistoryModal } from "./meter-change-history-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  AmberIconColor,
  BlueYellowIconColor,
  DeleteIcon,
  GreenIconColor,
  HistoryIcon,
  ProfileIcon,
  ReplaceWaterMeter,
  SetPriceIcon,
  TitleDarkColor,
  UsageIcon,
  WhiteIconColor,
} from "@/config/chip-and-icon";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import {
  CustomerLookupItem,
  CustomerLookupResponse,
  CustomerLookupTableProps,
  statusCustomerConfig,
  typeLabelMap,
} from "@/types";
import { CUSTOMER_LOOKUP_COLUMN } from "@/config/table-columns";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";
import { useRouter } from "next/navigation";

export const ResultsTable = ({
  keyword,
  reloadKey,

  onDeleted,
}: CustomerLookupTableProps) => {
  const [data, setData] = useState<CustomerLookupItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
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

        const res = await authFetch(
          `/api/customer/customer?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        setTotalItems(pageData?.totalItems ?? 0);
        setTotalPages(pageData?.totalPages ?? 1);

        const mapped = items.map(
          (item: CustomerLookupResponse, index: number) => ({
            id: item.customerId,
            stt: (page - 1) * pageSize + index + 1,
            name: item.name,
            phoneNumber: item.phoneNumber,
            householdRegistrationNumber: item.householdRegistrationNumber,
            monthlyRent: item.monthlyRent,
            type: item.type?.toUpperCase(),
            status: item.isActive,
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

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res = await authFetch(`/api/customer/customer/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      CallToast({
        title: "Thành công",
        message: "Xóa khách hàng thành công",
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
  const {
    isOpen: isPriceOpen,
    onOpen: onPriceOpen,
    onOpenChange: onPriceOpenChange,
  } = useDisclosure();
  const {
    isOpen: isMeterOpen,
    onOpen: onMeterOpen,
    onOpenChange: onMeterOpenChange,
  } = useDisclosure();

  const actionsItems = (id: string) => [
    {
      content: "Áp giá",
      color: "primary" as const,
      icon: SetPriceIcon,
      className: BlueYellowIconColor,
      onPress: onPriceOpen,
    },
    {
      content: "Tiêu thụ",
      color: "success" as const,
      icon: UsageIcon,
      className: GreenIconColor,
      href: "#",
    },
    {
      content: "Thay ĐH",
      color: "warning" as const,
      icon: ReplaceWaterMeter,
      className: AmberIconColor,
      onPress: onMeterOpen,
    },
    {
      content: "Lịch sử",
      icon: HistoryIcon,
      className: WhiteIconColor,
      href: `/customers/lookup/${id}/history`,
    },
    {
      content: "Hồ sơ",
      color: "primary" as const,
      icon: ProfileIcon,
      className: BlueYellowIconColor,
      href: `/customers/lookup/${id}`,
    },
    {
      content: "Xóa",
      icon: DeleteIcon,
      className: "text-red-500 hover:bg-red-50",
      onPress: () => setDeleteId(id),
    },
  ];
  const actionItems = useMemo(() => {
    return [
      // {
      //   content: "Chỉnh sửa",
      //   icon: EditIcon,
      //   className:
      //     "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
      //   onClick: (id: string) => {
      //     const found = data.find((i) => i.id === id);
      //     if (found) onEdit(found);
      //   },
      // },
      {
        content: "Áp giá",
        color: "primary" as const,
        icon: SetPriceIcon,
        className: BlueYellowIconColor,
        onClick: (id: string) => {
          setDeleteId(id);
        },
      },
      {
        content: "Tiêu thụ",
        color: "success" as const,
        icon: UsageIcon,
        className: GreenIconColor,
        onClick: (id: string) => {
          setDeleteId(id);
        },
      },
      {
        content: "Thay ĐH",
        color: "warning" as const,
        icon: ReplaceWaterMeter,
        className: AmberIconColor,
        onClick: (id: string) => {
          setDeleteId(id);
        },
      },
      {
        content: "Lịch sử",
        icon: HistoryIcon,
        className: WhiteIconColor,
        onClick: (id: string) => {
          setDeleteId(id);
        },
      },
      {
        content: "Hồ sơ",
        color: "primary" as const,
        icon: ProfileIcon,
        className: BlueYellowIconColor,
        onClick: (id: string) => {
          setDeleteId(id);
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
  }, [data]);

  const renderCell = (item: CustomerLookupItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );
      case "name":
        return (
          <span
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            onClick={() => router.push(`/customers/import/${item.id}`)}
          >
            {item.name}
          </span>
        );
      case "status":
        return (
          <Chip
            className={`
            ${statusCustomerConfig[item.status ? "Bình thường" : "Đã khóa"].className} 
            font-bold px-3 py-1 border-none rounded-full
          `}
            size="sm"
            variant="flat"
          >
            {item.status ? "Bình thường" : "Đã khóa"}
          </Chip>
        );

      case "type":
        return typeLabelMap[item.type ?? ""] ?? item.type ?? "-";
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
        return (item as any)[columnKey];
    }
  };

  return (
    <>
      <GenericDataTable
        isCollapsible
        columns={CUSTOMER_LOOKUP_COLUMN}
        data={data}
        headerSummary={`${data.length}`}
        icon={
          <div className="p-2 bg-blue-50 dark:bg-primary-500/10 rounded-lg text-blue-600 dark:text-primary">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
            </svg>
          </div>
        }
        paginationProps={{
          total: 1,
          page: 1,
          summary: `${data.length}`,
        }}
        renderCellAction={renderCell}
        title="Kết quả tìm kiếm"
      />
      <PriceApplicationModal
        isOpen={isPriceOpen}
        onOpenChangeAction={onPriceOpenChange}
      />
      <MeterChangeHistoryModal
        isOpen={isMeterOpen}
        onOpenChangeAction={onMeterOpenChange}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá khách hàng này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

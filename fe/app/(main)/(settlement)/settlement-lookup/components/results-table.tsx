"use client";

import React, { useState } from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DarkGreenChip, DarkRedChip } from "@/config/chip-and-icon";
import { CalculatorIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { SettlementItem, StatusDetailData } from "@/types";
import { SettlementDetailModal } from "./settlement-detail-modal";

interface SettlementTableProps {
  data: SettlementItem[];
}

const statusMap = {
  approved_budget: {
    label: "Đã duyệt dự toán",
    color: "success" as const,
    bg: DarkGreenChip,
  },
  rejected_budget: {
    label: "Lập lại dự toán",
    color: "danger" as const,
    bg: DarkRedChip,
  },
};

export const ResultsTable = ({ data }: SettlementTableProps) => {
  const [selectedSettlement, setSelectedSettlement] =
    useState<SettlementItem | null>(null);

  const mapSettlementToModalData = (
    item: SettlementItem
  ): StatusDetailData => ({
    code: item.code,
    address: item.address,
    registerDate: item.registerDate,
    status: statusMap[item.status]?.label ?? "Không xác định",
    creator: "Trần Thị A",
    createDate: "1/1/2026",
    approver: "Ngô Thị D",
    approveDate: "2/2/2026",
    totalPrice: "1000000000 VNĐ",
    note: "Công trình yêu cầu sử dụng thiết bị chất lượng cao. Đã tính toán bao gồm chi phí vận chuyển và lắp đặt.",
  });

  const columns = [
    { key: "stt", label: "STT", width: "40px" },
    { key: "code", label: "Mã đơn" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "registerDate", label: "Ngày đăng ký" },
    { key: "status", label: "Trạng thái đơn" },
    { key: "actions", label: "Hoạt động", align: "center" as const },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusClick = (item: SettlementItem) => {
    setSelectedSettlement(item);
    setIsModalOpen(true);
  };

  const renderCell = (item: SettlementItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      case "code":
        return (
          <Link
            as={NextLink}
            href="#"
            className="font-bold text-blue-600 hover:underline hover:text-blue-800 dark:text-primary dark:hover:text-primary-600"
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
        const config = statusMap[item.status];
        return (
          <button
            onClick={() => handleStatusClick(item)}
            className="hover:opacity-80 transition-opacity focus:outline-none"
          >
            <Chip
              size="sm"
              variant="flat"
              className={`${config.bg}`}
              color={config.color}
            >
              {config.label}
            </Chip>
          </button>
        );
      case "actions":
        const actions = [
          {
            content: "Quyết toán",
            icon: CalculatorIcon,
            className:
              "text-blue-600 dark:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30",
          },
          {
            content: "Chỉnh sửa",
            icon: PencilSquareIcon,
            className:
              "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
          },
        ];
        return (
          <div className="flex justify-center items-center gap-1">
            {actions.map((action, idx) => (
              <Tooltip
                key={idx}
                content={action.content}
                closeDelay={0}
                color={idx % 2 == 0 ? "primary" : "warning"}
              >
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className={action.className}
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

  return (
    <>
      <GenericDataTable
        title="Danh sách quyết toán"
        columns={columns}
        data={data}
        renderCell={renderCell}
        isCollapsible
        headerSummary={`${data.length}`}
        paginationProps={{
          total: 5,
          initialPage: 1,
          summary: `1-5 của 25`,
        }}
      />
      <SettlementDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={
          selectedSettlement
            ? mapSettlementToModalData(selectedSettlement)
            : undefined
        }
      />
    </>
  );
};

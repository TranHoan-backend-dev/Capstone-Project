"use client";

import React, { useState } from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { CalculatorIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import { SettlementDetailModal } from "./settlement-detail-modal";
import { SettlementDocumentModal } from "./settlement-document-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {DarkGreenChip, DarkRedChip, TitleDarkColor} from "@/config/chip-and-icon";
import { SettlementItem, StatusDetailData } from "@/types";

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
    item: SettlementItem,
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
  const [isEstimateOpen, setIsEstimateOpen] = useState(false);

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
        const config = statusMap[item.status];

        return (
          <button
            className="hover:opacity-80 transition-opacity focus:outline-none"
            onClick={() => handleStatusClick(item)}
          >
            <Chip
              className={`${config.bg}`}
              color={config.color}
              size="sm"
              variant="flat"
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
                closeDelay={0}
                color={idx % 2 == 0 ? "primary" : "warning"}
                content={action.content}
              >
                <Button
                  isIconOnly
                  className={action.className}
                  size="sm"
                  variant="light"
                  onPress={() => {
                    if (action.content === "Quyết toán") {
                      setIsEstimateOpen(true);
                    }
                  }}
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
        isCollapsible
        columns={columns}
        data={data}
        headerSummary={`${data.length}`}
        paginationProps={{
          total: 5,
          initialPage: 1,
          summary: `1-5 của 25`,
        }}
        renderCellAction={renderCell}
        title="Danh sách quyết toán"
      />
      <SettlementDetailModal
        data={
          selectedSettlement
            ? mapSettlementToModalData(selectedSettlement)
            : undefined
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <SettlementDocumentModal
        data={data}
        isOpen={isEstimateOpen}
        onCloseAction={() => setIsEstimateOpen(false)}
      />
    </>
  );
};

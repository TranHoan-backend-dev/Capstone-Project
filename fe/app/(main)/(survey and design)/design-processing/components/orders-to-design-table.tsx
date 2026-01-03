"use client";

import React, { useState } from "react";
import { Chip, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

import {
  ApprovalIcon,
  GreenIconColor,
  DarkBlueChip,
  DarkGreenChip,
  DarkPurpleChip,
  DarkRedChip,
  DarkGrayChip,
} from "@/config/chip-and-icon";
import { DesignProcessingItem, StatusDetailData } from "@/types";
import { DesignProcessingModal } from "./design-processing-modal";

interface OrdersToDesignTableProps {
  data: DesignProcessingItem[];
  onApprove?: (item: any) => void;
}

const statusMap = {
  paid: {
    label: "Đã thanh toán",
    color: "success",
    bg: DarkGreenChip,
  },
  processing: {
    label: "Đang xử lý",
    color: "default",
    bg: DarkPurpleChip,
  },
  pending_restore: {
    label: "Chờ khôi phục",
    color: "success",
    bg: DarkGreenChip,
  },
  rejected: {
    label: "Từ chối",
    color: "danger",
    bg: DarkRedChip,
  },
  none: {
    label: "Không có",
    color: "default",
    bg: DarkGrayChip,
  },
} as const;

export const OrdersToDesignTable = ({
  data,
  onApprove,
}: OrdersToDesignTableProps) => {
  const [selectedDesign, setSelectedDesign] =
    useState<DesignProcessingItem | null>(null);

  const mapDesignToModalData = (
    item: DesignProcessingItem
  ): StatusDetailData => ({
    code: item.code,
    address: item.address,
    registerDate: item.registrationDate,
    status: statusMap[item.status]?.label ?? "Không xác định",
    creator: "",
    createDate: "",
    approver: "",
    approveDate: "",
    totalPrice: "",
    note: "",
  });

  const columns: any[] = [
    { key: "no", label: "#", align: "center", width: "60px" },
    { key: "code", label: "Mã đơn" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
    { key: "registrationDate", label: "Ngày đăng ký" },
    { key: "surveyAppointment", label: "Ngày hẹn khảo sát" },
    { key: "status", label: "Trạng thái đơn", align: "center" },
    { key: "activities", label: "Hoạt động", align: "center" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesignOpen, setIsDesignOpen] = useState(false);

  const handleStatusClick = (item: DesignProcessingItem) => {
    setSelectedDesign(item);
    setIsModalOpen(true);
  };

  const renderCell = (item: DesignProcessingItem, columnKey: string) => {
    switch (columnKey) {
      case "no":
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
              className={`font-bold ${config.bg}`}
              color={`${config.color}`}
            >
              {config.label}
            </Chip>
          </button>
        );
      case "activities":
        return (
          <div className="flex justify-center">
            <Tooltip content="Duyệt" color="success">
              <ApprovalIcon
                className={GreenIconColor}
                onClick={() => onApprove?.(item)}
              />
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey as keyof DesignProcessingItem];
    }
  };

  return (
    <>
      <GenericDataTable
        title="Danh sách đơn chờ thiết kế"
        columns={columns}
        data={data}
        renderCell={renderCell}
        isCollapsible
        paginationProps={{
          total: 5,
          initialPage: 1,
          summary: `${data.length}`,
        }}
        headerSummary={`${data.length}`}
      />
      <DesignProcessingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedDesign ? mapDesignToModalData(selectedDesign) : undefined}
      />
    </>
  );
};

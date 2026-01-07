"use client";

import React, { useState } from "react";
import { Chip, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";

import { DesignProcessingModal } from "./design-processing-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  ApprovalIcon,
  GreenIconColor,
  DarkGreenChip,
  DarkPurpleChip,
  DarkRedChip,
  DarkGrayChip, TitleDarkColor,
} from "@/config/chip-and-icon";
import { DesignProcessingItem, StatusDetailData } from "@/types";

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
    item: DesignProcessingItem,
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
              className={`font-bold ${config.bg}`}
              color={`${config.color}`}
              size="sm"
              variant="flat"
            >
              {config.label}
            </Chip>
          </button>
        );
      case "activities":
        return (
          <div className="flex justify-center">
            <Tooltip color="success" content="Duyệt">
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
        isCollapsible
        columns={columns}
        data={data}
        headerSummary={`${data.length}`}
        paginationProps={{
          total: 5,
          initialPage: 1,
          summary: `${data.length}`,
        }}
        renderCellAction={renderCell}
        title="Danh sách đơn chờ thiết kế"
      />
      <DesignProcessingModal
        data={selectedDesign ? mapDesignToModalData(selectedDesign) : undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

"use client";

import React, { useState } from "react";
import { Chip, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";

import { DesignProcessingModal } from "./design-processing-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  BlueYellowIconColor,
  DarkGreenChip,
  DarkRedChip,
  RestoreIcon,
  DarkGrayChip,
  DarkPurpleChip, TitleDarkColor,
} from "@/config/chip-and-icon";
import { DesignProcessingItem, StatusDetailData } from "@/types";

interface WaitingInputTableProps {
  data: DesignProcessingItem[];
  onRestore?: (item: any) => void;
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

export const WaitingInputTable = ({
  data,
  onRestore,
}: WaitingInputTableProps) => {
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
    { key: "stt", label: "#", align: "center", width: "60px" },
    { key: "code", label: "Mã đơn" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
    { key: "registrationDate", label: "Ngày đăng ký" },
    { key: "surveyAppointment", label: "Ngày hẹn khảo sát" },
    { key: "status", label: "Trạng thái", align: "center" },
    { key: "action", label: "Hoạt động", align: "center" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusClick = (item: DesignProcessingItem) => {
    setSelectedDesign(item);
    setIsModalOpen(true);
  };

  const renderCell = (item: DesignProcessingItem, columnKey: string) => {
    switch (columnKey) {
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
      case "action":
        return (
          <div className="flex justify-center">
            <Tooltip color="primary" content="Khôi phục">
              <RestoreIcon
                className={BlueYellowIconColor}
                onClick={() => onRestore?.(item)}
              />
            </Tooltip>
          </div>
        );
      case "stt":
        return (
          <span className="text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      default:
        return (
          <span className="text-gray-600 dark:text-default-600">
            {item[columnKey as keyof DesignProcessingItem]}
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
          summary: `${data.length}`,
        }}
        renderCellAction={renderCell}
        title="Danh sách đang chờ đầu vào & từ chối thiết kế"
      />
      <DesignProcessingModal
        data={selectedDesign ? mapDesignToModalData(selectedDesign) : undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

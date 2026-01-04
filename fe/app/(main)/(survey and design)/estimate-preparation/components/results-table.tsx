"use client";

import React, { useState } from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";

import { EstimateDetailModal } from "./estimate-detail-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DarkGreenChip,
  DarkRedChip,
  EstimationIcon,
  GreenIconColor,
} from "@/config/chip-and-icon";
import { StatusDetailData, EstimateItem } from "@/types";

interface ResultsTableProps {
  data: EstimateItem[];
}

const statusMap = {
  pending_estimate: {
    label: "Chờ lập dự toán",
    color: "success" as const,
    bg: DarkGreenChip,
  },
  rejected: {
    label: "Chưa được phê duyệt",
    color: "danger" as const,
    bg: DarkRedChip,
  },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
  const columns = [
    { key: "stt", label: "STT", width: "60px" },
    { key: "code", label: "Mã đơn" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
    { key: "registerDate", label: "Ngày đăng ký" },
    { key: "status", label: "Trạng thái đơn" },
    { key: "actions", label: "Hoạt động", align: "center" as const },
  ];

  const baseStyle = "text-gray-500 dark:text-default-500";
  const [selectedEstimate, setSelectedEstimate] = useState<EstimateItem | null>(
    null,
  );
  const mapEstimateToModalData = (item: EstimateItem): StatusDetailData => ({
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusClick = (item: EstimateItem) => {
    setSelectedEstimate(item);
    setIsModalOpen(true);
  };

  const renderCell = (item: EstimateItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      case "code":
        return (
          <Link
            as={NextLink}
            className="font-bold text-[#2a66e4] dark:text-primary underline underline-offset-4 hover:text-blue-800 dark:hover:text-primary-600"
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
      case "phone":
        return <span className={`${baseStyle}`}>{item.phone}</span>;
      case "address":
        return <span className={`${baseStyle}`}>{item.address}</span>;
      case "registerDate":
        return <span className={`${baseStyle}`}>{item.registerDate}</span>;
      case "status":
        const config = statusMap[item.status];

        return (
          <Chip
            className={`${config.bg}`}
            color={config.color}
            size="sm"
            variant="flat"
          >
            {config.label}
          </Chip>
        );
      case "actions":
        return (
          <Tooltip closeDelay={0} color="success" content="Chạy dự toán">
            <Button
              isIconOnly
              as={NextLink}
              href="/estimate-preparation"
              size="sm"
              variant="light"
            >
              <EstimationIcon className={GreenIconColor} />
            </Button>
          </Tooltip>
        );
      default:
        return (item as any)[columnKey];
    }
  };

  return (
    <>
      <GenericDataTable
        isCollapsible
        columns={columns}
        data={data}
        paginationProps={{
          total: 5,
          initialPage: 1,
          summary: "1-5 của 25",
        }}
        renderCell={renderCell}
        title="Danh sách lập dự toán"
      />
      <EstimateDetailModal
        data={
          selectedEstimate
            ? mapEstimateToModalData(selectedEstimate)
            : undefined
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

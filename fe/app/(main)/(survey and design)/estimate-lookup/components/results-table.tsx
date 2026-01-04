"use client";

import React from "react";
import { Button, Chip, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DarkBlueChip,
  DarkGreenChip,
  DarkRedChip,
  DarkYellowChip,
  EditIcon,
  AmberIconColor,
  EstimationIcon,
  ProfileIcon,
  BlueYellowIconColor,
  GreenIconColor,
} from "@/config/chip-and-icon";

interface EstimateItem {
  id: number;
  code: string;
  name: string;
  phone: string;
  address: string;
  date: string;
  status: "approved" | "pending_approval" | "pending_estimate" | "redo";
}

interface ResultsTableProps {
  data: EstimateItem[];
}

const statusMap = {
  approved: {
    label: "Đã duyệt dự toán",
    color: "success" as const,
    bg: `bg-green-100 text-green-700 ${DarkGreenChip}`,
  },
  pending_approval: {
    label: "Chờ duyệt dự toán",
    color: "primary" as const,
    bg: `bg-blue-100 text-blue-700 ${DarkBlueChip}`,
  },
  pending_estimate: {
    label: "Chờ lập dự toán",
    color: "default" as const,
    bg: `bg-gray-100 text-gray-700 ${DarkYellowChip}`,
  },
  redo: {
    label: "Lập lại dự toán",
    color: "danger" as const,
    bg: `bg-red-100 text-red-700 ${DarkRedChip}`,
  },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
  const columns = [
    { key: "no", label: "#" },
    { key: "code", label: "Mã đơn" },
    { key: "name", label: "Tên thiết kế" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "date", label: "Ngày đăng ký" },
    { key: "status", label: "Trạng thái đơn" },
    { key: "actions", label: "Hoạt động", align: "center" as const },
  ];

  const renderCell = (item: EstimateItem, columnKey: string) => {
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
            className="font-bold text-blue-600 hover:underline hover:text-blue-800 dark:text-primary dark:hover:text-primary-600"
            href="#"
          >
            {item.code}
          </Link>
        );
      case "name":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.name}
          </span>
        );
      case "status":
        const config = statusMap[item.status];

        return (
          <Chip
            className={`${config.bg} border-none font-medium px-2`}
            size="sm"
            variant="flat"
          >
            {config.label}
          </Chip>
        );
      case "actions":
        const actionButtons = [
          {
            content: "Dự toán",
            color: "success" as const,
            icon: EstimationIcon,
            className: GreenIconColor,
          },
          {
            content: "Chỉnh sửa",
            color: "warning" as const,
            icon: EditIcon,
            className: AmberIconColor,
          },
          {
            content: "Hồ sơ",
            color: "primary" as const,
            icon: ProfileIcon,
            className: BlueYellowIconColor,
          },
        ];

        return (
          <div className="flex items-center justify-center gap-5">
            {actionButtons.map((btn, idx) => (
              <Tooltip key={idx} color={btn.color} content={btn.content}>
                <Button isIconOnly size="sm" variant="light">
                  <btn.icon className={btn.className} />
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
      renderCell={renderCell}
      title="Danh sách đơn thiết kế"
    />
  );
};

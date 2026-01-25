"use client";

import React from "react";
import { Chip, Link, Tooltip, Button, useDisclosure } from "@heroui/react";
import NextLink from "next/link";

import { PriceApplicationModal } from "./price-application-modal";
import { MeterChangeHistoryModal } from "./meter-change-history-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  AmberIconColor,
  BlueYellowIconColor,
  DarkBlueChip,
  DarkGreenChip,
  DarkRedChip,
  DarkYellowChip,
  GreenIconColor,
  HistoryIcon,
  ProfileIcon,
  ReplaceWaterMeter,
  SetPriceIcon,
  TitleDarkColor,
  UsageIcon,
  WhiteIconColor,
} from "@/config/chip-and-icon";

interface Customer {
  id: number;
  customerCode: string;
  oldCustomerCode: string;
  number: string;
  customerName: string;
  address: string;
  status: string;
}

interface ResultsTableProps {
  data: Customer[];
}

const statusConfig: Record<string, { className: string }> = {
  "Bình thường": {
    className: `bg-green-100 text-green-700 ${DarkGreenChip}`,
  },
  "Chờ duyệt": {
    className: `bg-blue-100 text-blue-700 ${DarkBlueChip}`,
  },
  "Tạm ngưng": {
    className: `bg-amber-100 text-amber-700 ${DarkYellowChip}`,
  },
  "Đã khóa": {
    className: `bg-red-100 text-red-700 ${DarkRedChip}`,
  },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
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

  const columns = [
    { key: "no", label: "#" },
    { key: "customerCode", label: "Mã KH" },
    { key: "oldCustomerCode", label: "Mã KH cũ" },
    { key: "number", label: "Số" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "address", label: "Địa chỉ" },
    { key: "status", label: "Tình trạng" },
    { key: "actions", label: "Thao tác", align: "center" as const },
  ];

  const actionsItems = (id: number) => [
    {
      content: "Áp giá",
      color: "primary" as const,
      icon: SetPriceIcon,
      className: BlueYellowIconColor,
      onPress: onPriceOpen,
    },
    // Nút tiêu thụ ở đây là trình bày báo cáo dạng word
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
  ];

  const renderCell = (item: Customer, columnKey: string) => {
    switch (columnKey) {
      case "no":
        return (
          <span className="font-medium text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      case "customerCode":
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href="#"
          >
            {item.customerCode}
          </Link>
        );
      case "oldCustomerCode":
        return (
          <span className="font-medium text-gray-500 dark:text-default-500">
            {item.oldCustomerCode}
          </span>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );
      case "status":
        return (
          <Chip
            className={`${statusConfig[item.status].className} font-bold px-3 py-1 border-none rounded-full`}
            size="sm"
            variant="flat"
          >
            {item.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-1">
            {actionsItems(item.id).map((action, idx) => (
              <Tooltip
                key={idx}
                closeDelay={0}
                color={action.color ?? "default"}
                content={action.content}
              >
                <Button
                  isIconOnly
                  as={action.href ? NextLink : "button"}
                  className={action.className}
                  href={action.href}
                  size="sm"
                  variant="light"
                  onPress={action.onPress}
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
        columns={columns}
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
          initialPage: 1,
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
    </>
  );
};

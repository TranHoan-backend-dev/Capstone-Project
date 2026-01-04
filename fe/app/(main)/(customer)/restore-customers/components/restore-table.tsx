"use client";

import React from "react";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { Link } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface RestoreItem {
  id: number;
  customerCode: string;
  customerName: string;
  address: string;
  restoreDate: string;
  period: string;
  reason: string;
}

interface RestoreTableProps {
  data: RestoreItem[];
}

export const RestoreTable = ({ data }: RestoreTableProps) => {
  const columns = [
    { key: "no", label: "#", width: "40px" },
    { key: "customerCode", label: "Mã KH" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "address", label: "Địa chỉ" },
    { key: "restoreDate", label: "Ngày Khôi Phục" },
    { key: "period", label: "Kỳ Khôi Phục" },
    { key: "reason", label: "Lý Do Khôi Phục" },
  ];

  const renderCell = (item: RestoreItem, columnKey: string) => {
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
            className="font-bold text-blue-600 hover:underline hover:text-blue-800 dark:text-primary"
            href="#"
          >
            {item.customerCode}
          </Link>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );
      case "address":
        return <div className="max-w-[200px] truncate">{item.address}</div>;
      case "restoreDate":
        return (
          <span className="text-gray-400 dark:text-white">
            {item.restoreDate}
          </span>
        );
      case "period":
        return (
          <span className="font-bold text-blue-600 dark:text-primary-400 bg-blue-50 dark:bg-white px-2 py-0.5 rounded text-[11px] border border-blue-100/50 dark:border-primary-500/30">
            {item.period}
          </span>
        );
      case "reason":
        return (
          <div className="text-gray-500 dark:text-white italic max-w-[250px] truncate">
            {item.reason}
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
      icon={
        <div className="p-2 bg-blue-50 dark:bg-primary-900/10 rounded-lg text-blue-600 dark:text-primary">
          <TableCellsIcon className="w-4 h-4" />
        </div>
      }
      paginationProps={{
        total: 1,
        initialPage: 1,
        summary: `${data.length}`,
      }}
      renderCell={renderCell}
      title="Danh sách KH khôi phục"
    />
  );
};

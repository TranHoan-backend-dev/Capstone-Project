"use client";

import React, { useState } from "react";
import { Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DeleteIcon,
  ProfileIcon,
  RejectIcon,
  RedIconColor,
  BlueYellowIconColor,
  TitleDarkColor,
} from "@/config/chip-and-icon";
import { PROCESSED_DESIGN_COLUMN } from "@/config/table-columns";
import { DesignProcessingItem } from "@/types";

interface ProcessedDesignsTableProps {
  data: any[];
  onReject?: (item: any) => void;
}

export const ProcessedDesignsTable = ({
  data,
  onReject,
}: ProcessedDesignsTableProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const renderCell = (item: DesignProcessingItem, columnKey: string) => {
    switch (columnKey) {
      case "code":
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href="#"
          >
            {item.formNumber}
          </Link>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );
      case "activities":
        return (
          <div className="flex justify-center items-center gap-5">
            <Tooltip color="danger" content="Từ chối">
              <RejectIcon
                className={RedIconColor}
                onClick={() => onReject?.(item)}
              />
            </Tooltip>
            <Tooltip color="danger" content="Xóa">
              <DeleteIcon className={RedIconColor} />
            </Tooltip>
          </div>
        );
      case "docs":
        return (
          <div className="flex justify-center">
            <ProfileIcon className={BlueYellowIconColor} />
          </div>
        );
      case "no":
        return (
          <span className="font-medium text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      default:
        return item[columnKey as keyof DesignProcessingItem];
    }
  };

  return (
    <GenericDataTable
      isCollapsible
      columns={PROCESSED_DESIGN_COLUMN}
      data={data}
      headerSummary={`${data.length}`}
      paginationProps={{
        total: totalPages,
        page: page,
        onChange: setPage,
        summary: `${data.length}`,
      }}
      renderCellAction={renderCell}
      title="Danh sách đơn đang xử lý thiết kế"
    />
  );
};

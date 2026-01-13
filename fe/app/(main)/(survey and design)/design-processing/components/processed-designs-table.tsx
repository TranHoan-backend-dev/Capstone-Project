"use client";

import React from "react";
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

interface ProcessedDesignsTableProps {
  data: any[];
  onReject?: (item: any) => void;
}

export const ProcessedDesignsTable = ({
  data,
  onReject,
}: ProcessedDesignsTableProps) => {
  const columns: any[] = [
    { key: "no", label: "#", align: "center", width: "60px" },
    { key: "code", label: "Mã đơn" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
    { key: "registrationDate", label: "Ngày đăng ký" },
    { key: "surveyAppointment", label: "Ngày hẹn khảo sát" },
    { key: "activities", label: "Hoạt động", align: "center" },
    { key: "docs", label: "Hồ sơ", align: "center" },
  ];

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "code":
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href="#"
          >
            {cellValue}
          </Link>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {cellValue}
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
        return cellValue;
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
      renderCellAction={renderCell}
      title="Danh sách đã xử lý đơn đã thiết kế"
    />
  );
};

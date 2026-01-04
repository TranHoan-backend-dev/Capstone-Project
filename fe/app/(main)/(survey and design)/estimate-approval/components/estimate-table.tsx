"use client";

import React from "react";
import { Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  ApprovalIcon,
  GreenIconColor,
  EstimationIcon,
  BlueYellowIconColor,
  RejectIcon,
  RedIconColor,
  ViewIcon,
} from "@/config/chip-and-icon";

export interface EstimateOrder {
  id: number;
  code: string;
  designProfileName: string;
  phone: string;
  installationAddress: string;
  totalAmount: string; // Formatted string or number
  createdDate: string;
  creator: string;
  status: "pending" | "approved" | "rejected";
}

interface EstimateTableProps {
  data: EstimateOrder[];
  activeTab: string; // "pending" or "approved"
  onApprove: (item: EstimateOrder) => void;
  onReject: (item: EstimateOrder) => void;
  onView: (item: EstimateOrder) => void;
  onEstimate: (item: EstimateOrder) => void;
}

export const EstimateTable = ({
  data,
  onApprove,
  onReject,
  onView,
  onEstimate,
}: EstimateTableProps) => {
  const columns = [
    { key: "stt", label: "STT", align: "center", width: "50px" },
    { key: "code", label: "Mã đơn", align: "start" },
    { key: "designProfileName", label: "Tên hồ sơ thiết kế", align: "start" },
    { key: "phone", label: "Điện thoại", align: "start" },
    { key: "installationAddress", label: "Địa chỉ lắp đặt", align: "start" },
    { key: "totalAmount", label: "Tổng tiền", align: "end" },
    { key: "createdDate", label: "Ngày lập", align: "center" },
    { key: "creator", label: "Người lập", align: "start" },
    { key: "actions", label: "Hành động", align: "center" },
  ] as const;

  const renderCell = (item: EstimateOrder, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span>{item.id}</span>; // Using ID as STT for simplicity
      case "code":
        return <span className="font-semibold">{item.code}</span>;
      case "designProfileName":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {item.designProfileName}
            </span>
          </div>
        );
      case "totalAmount":
        return (
          <span className="text-primary font-bold">{item.totalAmount}</span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip color="success" content="Duyệt">
              <ApprovalIcon
                className={GreenIconColor}
                onClick={() => onApprove(item)}
              />
            </Tooltip>
            <Tooltip color="danger" content="Từ chối">
              <RejectIcon
                className={RedIconColor}
                onClick={() => onReject(item)}
              />
            </Tooltip>
            <Tooltip color="primary" content="Dự toán">
              <EstimationIcon
                className={BlueYellowIconColor}
                onClick={() => onEstimate(item)}
              />
            </Tooltip>
            <Tooltip color="primary" content="Xem">
              <ViewIcon
                className={BlueYellowIconColor}
                onClick={() => onView(item)}
              />
            </Tooltip>
          </div>
        );
      default:
        // @ts-ignore
        return item[columnKey];
    }
  };

  return (
    <GenericDataTable
      columns={columns as any}
      data={data}
      headerSummary={data.length.toString()}
      isCollapsible={false}
      paginationProps={{
        total: Math.ceil(data.length / 5),
        initialPage: 1,
        summary: `1-5 trong tổng số ${data.length}`,
      }}
      renderCell={renderCell}
      tableProps={{
        selectionMode: "none",
      }}
      title=""
    />
  );
};

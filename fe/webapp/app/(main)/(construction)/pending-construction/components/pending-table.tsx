"use client";

import React from "react";
import { Button, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { CancelIcon, CheckApprovalIcon } from "@/config/chip-and-icon";

interface PendingRecord {
  id: string;
  contractNo: string;
  project: string;
  phone: string;
  address: string;
  date: string;
}

export const PendingTable = () => {
  const columns = [
    { key: "id", label: "Mã đơn" },
    { key: "contractNo", label: "Số hợp đồng" },
    { key: "project", label: "Tên công trình" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "date", label: "Ngày đăng ký" },
    { key: "actions", label: "Hành động", align: "center" as const },
  ];

  const actionItems = [
    {
      content: "Duyệt đơn",
      icon: CheckApprovalIcon,
      color: "success" as const,
      className: "text-green-600 hover:bg-green-50",
      onClick: (id: string) => console.log("Duyệt:", id),
    },
    {
      content: "Từ chối đơn",
      icon: CancelIcon,
      color: "danger" as const,
      className: "text-red-500 hover:bg-red-50",
      onClick: (id: string) => console.log("Từ chối:", id),
    },
  ];

  const mockData: PendingRecord[] = [
    {
      id: "TC-2024-001",
      contractNo: "HD-2024-156",
      project: "Nhà ở gia đình Anh Minh",
      phone: "0912 345 678",
      address: "123 Lê Lợi, Q. Gò Vấp, TP.HCM",
      date: "15/12/2024",
    },
  ];

  const renderCell = (item: PendingRecord, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="font-medium text-blue-600">{item.id}</span>;

      case "project":
        return <span className="font-semibold">{item.project}</span>;

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {actionItems.map((action, idx) => (
              <Tooltip
                key={idx}
                content={action.content}
                closeDelay={0}
                color={action.color}
              >
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className={`${action.className} rounded-lg`}
                  onPress={() => action.onClick(item.id)}
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
    <GenericDataTable
      title="Danh sách đơn chờ"
      columns={columns}
      data={mockData}
      isCollapsible
      headerSummary={`${mockData.length}`}
      renderCellAction={renderCell}
      paginationProps={{
        total: mockData.length,
        initialPage: 1,
        summary: `${mockData.length}`,
      }}
    />
  );
};

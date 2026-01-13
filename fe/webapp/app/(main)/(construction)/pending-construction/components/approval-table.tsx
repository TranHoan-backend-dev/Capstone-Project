"use client";

import { Button, Tooltip } from "@heroui/react";
import React from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DeleteIcon } from "@/config/chip-and-icon";

interface ApprovedRecord {
  id: string;
  contractNo: string;
  project: string;
  phone: string;
  address: string;
  date: string;
}

export const ApprovedTable = () => {
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
      content: "Xóa",
      icon: DeleteIcon,
      className: "text-red-500 hover:bg-red-50",
      onClick: (id: string) => console.log("Xóa:", id),
    },
  ];

  const mockData: ApprovedRecord[] = [
    {
      id: "TC-2024-006",
      contractNo: "HD-2024-156",
      project: "Nhà ở gia đình Anh Minh",
      phone: "0901 234 567",
      address: "12 Trần Hưng Đạo, P.5, Q.5, TP.HCM",
      date: "10/12/2024",
    },
  ];

  const renderCell = (item: ApprovedRecord, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="font-medium text-blue-600">{item.id}</span>;

      case "project":
        return <span className="font-semibold">{item.project}</span>;

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {actionItems.map((action, idx) => (
              <Tooltip key={idx} content={action.content} closeDelay={0}>
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
      title="Danh sách đơn cho phép thi công"
      columns={columns}
      data={mockData}
      isCollapsible
      renderCellAction={renderCell}
      headerSummary={`${mockData.length}`}
      paginationProps={{
        total: mockData.length,
        initialPage: 1,
        summary: `${mockData.length}`,
      }}
    />
  );
};

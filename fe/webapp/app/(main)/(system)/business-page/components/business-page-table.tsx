"use client";

import { Button, Tooltip } from "@heroui/react";
import React from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DeleteIcon } from "@/config/chip-and-icon";

interface ApprovedRecord {
  id: string;
  nameBusinessPage: string;
  status: string;
  creator: string;
  updator: string;
}

export const BusinessPageTable = () => {
  const columns = [
    { key: "id", label: "Mã trang doanh nghiệp" },
    { key: "nameBusinessPage", label: "Tên trang doanh nghiệp" },
    { key: "status", label: "Trạng thái" },
    { key: "creator", label: "Người tạo" },
    { key: "updator", label: "Người cập nhật" },
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
      id: "TC-2024",
      nameBusinessPage: "Quản trị hệ thống",
      status: "Hoạt động",
      creator: "aDMIN",
      updator: "aDMIN",
    },
  ];

  const renderCell = (item: ApprovedRecord, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="font-medium text-blue-600">{item.id}</span>;

      case "nameBusinessPage":
        return <span className="font-semibold">{item.nameBusinessPage}</span>;

      case "status":
        return <span className="text-green-600">{item.status}</span>;

      case "creator":
        return <span className="text-gray-700">{item.creator}</span>;

      case "updator":
        return <span className="text-gray-700">{item.updator}</span>;

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
      title="Danh sách trang doanh nghiệp"
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

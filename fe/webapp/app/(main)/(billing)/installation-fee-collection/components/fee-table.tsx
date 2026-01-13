"use client";

import { PencilIcon } from "@heroicons/react/24/outline";
import { Button, Chip, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  BlueYellowIconColor,
  DeleteIcon,
  RedIconColor,
} from "@/config/chip-and-icon";

export const FeeTable = () => {
  const columns = [
    { key: "no", label: "STT" },
    { key: "orderId", label: "Mã đơn" },
    { key: "receiptId", label: "Số phiếu thu" },
    { key: "name", label: "Tên khách hàng" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "date", label: "Ngày thu" },
    { key: "amount", label: "Số tiền" },
    { key: "status", label: "Trạng thái" },
    { key: "actions", label: "Hành động", align: "center" as const },
  ];

  const mockData = [
    {
      id: "1",
      no: 1,
      orderId: "DH001",
      receiptId: "PT001",
      name: "Nguyễn Văn A",
      address: "123 Nguyễn Trãi, P.1, Q.5",
      date: "15/12/2024",
      amount: "2,500,000 VND",
      status: "Đã thu",
    },
    {
      id: "2",
      no: 2,
      orderId: "DH002",
      receiptId: "PT002",
      name: "Trần Thị B",
      address: "456 Lê Lợi, P.2, Q.1",
      date: "16/12/2024",
      amount: "3,200,000 VND",
      status: "Chưa thu",
    },
    {
      id: "3",
      no: 3,
      orderId: "DH003",
      receiptId: "PT003",
      name: "Lê Văn C",
      address: "789 Võ Văn Tần, P.5, Q.3",
      date: "17/12/2024",
      amount: "1,800,000 VND",
      status: "Đã thu",
    },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "orderId":
        return <span className="text-blue-600 font-bold">{item.orderId}</span>;
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.status === "Đã thu" ? "success" : "warning"}
          >
            {item.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex justify-center gap-2">
            {[
              {
                content: "Sửa phiếu thu",
                icon: <PencilIcon className={BlueYellowIconColor} />,
                color: "primary" as const,
              },
              {
                content: "Xóa phiếu thu",
                icon: <DeleteIcon className={RedIconColor} />,
                color: "danger" as const,
              },
            ].map(({ content, icon, color }, index) => (
              <Tooltip key={index} content={content} color={color}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-blue-600"
                >
                  {icon}
                </Button>
              </Tooltip>
            ))}
          </div>
        );

      default:
        return item[columnKey];
    }
  };

  return (
    <GenericDataTable
      title="Danh sách phiếu thu"
      columns={columns}
      data={mockData}
      renderCellAction={renderCell}
    />
  );
};

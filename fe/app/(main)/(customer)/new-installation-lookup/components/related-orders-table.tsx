"use client";

import { Button, Tooltip } from "@heroui/react";

import { StatusBar } from "./status-bar";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DeleteIcon, RedIconColor } from "@/config/chip-and-icon";

export const RelatedOrdersTable = ({ data }: { data: any[] }) => {
  const columns = [
    { key: "no", label: "STT", width: "60px" },
    { key: "code", label: "Mã đơn" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "status", label: "Trạng thái", align: "center" as const },
    { key: "actions", label: "Hoạt động", align: "center" as const },
  ];

  const actionButtons = [
    {
      content: "Xóa",
      icon: DeleteIcon,
      className: RedIconColor,
      color: "danger" as const,
    },
  ];

  const renderCell = (item: any, key: string) => {
    if (key === "no") return data.indexOf(item) + 1;
    if (key === "status") {
      if (key === "status") {
        return <StatusBar stage={item.stage} status={item.status} />;
      }
    }
    if (key === "actions") {
      return (
        <div className="flex items-center gap-2 justify-center">
          {actionButtons.map((action, idx) => (
            <Tooltip
              key={idx}
              closeDelay={0}
              color={action.color}
              content={action.content}
            >
              <Button
                isIconOnly
                className={action.className}
                size="sm"
                variant="light"
              >
                <action.icon className="w-5 h-5" />
              </Button>
            </Tooltip>
          ))}
        </div>
      );
    }

    return item[key];
  };

  return (
    <GenericDataTable
      columns={columns}
      data={data}
      paginationProps={{ total: 3, initialPage: 1 }}
      renderCell={renderCell}
      title="Danh sách đơn"
    />
  );
};

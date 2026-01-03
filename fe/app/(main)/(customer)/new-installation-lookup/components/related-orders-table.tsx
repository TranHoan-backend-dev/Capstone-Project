"use client";

import { Button, Tooltip } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { StatusBar } from "./status-bar";
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
              content={action.content}
              color={action.color}
              closeDelay={0}
            >
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className={action.className}
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
      title="Danh sách đơn"
      columns={columns}
      data={data}
      renderCell={renderCell}
      paginationProps={{ total: 3, initialPage: 1 }}
    />
  );
};

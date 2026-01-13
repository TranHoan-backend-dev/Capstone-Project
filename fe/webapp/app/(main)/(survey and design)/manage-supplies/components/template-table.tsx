"use client";

import React from "react";
import { Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  AmberIconColor,
  BlueYellowIconColor,
  DeleteIcon,
  EditIcon,
  LoadingMaterialsIcon,
  RedIconColor,
} from "@/config/chip-and-icon";

interface MaterialTemplate {
  id: number;
  code: string;
  name: string;
  createdAt: string;
}

interface TemplateTableProps {
  data: MaterialTemplate[];
}

export const TemplateTable = ({ data }: TemplateTableProps) => {
  const columns = [
    { key: "no", label: "STT", align: "center" as const, width: "60px" },
    { key: "code", label: "Mã mẫu" },
    { key: "name", label: "Tên mẫu bốc vật tư" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "activities", label: "Thao tác", align: "center" as const },
  ];

  const baseStyle = "text-gray-600 dark:text-white";

  const renderCell = (item: MaterialTemplate, columnKey: string) => {
    switch (columnKey) {
      case "no":
        return (
          <span className="font-medium text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      case "code":
        return <span className={baseStyle}>{item.code}</span>;
      case "name":
        return <span className={baseStyle}>{item.name}</span>;
      case "createdAt":
        return <span className={baseStyle}>{item.createdAt}</span>;
      case "activities":
        const actions = [
          {
            content: "Bốc vật tư",
            icon: LoadingMaterialsIcon,
            className: BlueYellowIconColor,
            color: "primary" as const,
            href: "#",
          },
          {
            content: "Sửa",
            icon: EditIcon,
            className: AmberIconColor,
            color: "warning" as const,
            href: "#",
          },
          {
            content: "Xóa",
            icon: DeleteIcon,
            className: RedIconColor,
            color: "danger" as const,
            href: "#",
          },
        ];

        return (
          <div className="flex justify-center items-center gap-2">
            {actions.map((action, idx) => (
              <Tooltip
                key={idx}
                closeDelay={0}
                color={action.color}
                content={action.content}
              >
                <Button
                  isIconOnly
                  as={NextLink}
                  className={action.className}
                  href={action.href}
                  size="sm"
                  variant="light"
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
      isCollapsible
      actions={<></>}
      columns={columns}
      data={data}
      headerSummary={`${data.length}`}
      paginationProps={{
        total: 5,
        initialPage: 1,
        summary: `1-${data.length} của 25`,
      }}
      renderCellAction={renderCell}
      title="Danh sách mẫu vật tư"
    />
  );
};

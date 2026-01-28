"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import {
  ApprovalIcon,
  DeleteIcon,
  DocumentChartIcon,
} from "@/config/chip-and-icon";
import CustomButton from "@/components/ui/custom/CustomButton";

export const MaterialCostCard = () => {
  const materials = [
    {
      id: "1",
      index: 1,
      code: "ONG80-20",
      description: "Ống nhựa HDPE",
      note: "",
      unit: "Mét",
      reductionFactor: 1,
      quantity: 3,
      materialPrice: 7600,
      laborPrice: 4189,
      materialTotal: 22800,
      laborTotal: 12567,
    },
    {
      id: "2",
      index: 2,
      code: "ONG80-20",
      description: "Ống nhựa HDPE",
      note: "",
      unit: "Mét",
      reductionFactor: 1,
      quantity: 3,
      materialPrice: 7600,
      laborPrice: 4189,
      materialTotal: 22800,
      laborTotal: 12567,
    },
  ];

  const columns = [
    { key: "index", label: "#", width: "50px" },
    { key: "code", label: "Mã vật tư" },
    { key: "description", label: "Nội dung công việc" },
    { key: "note", label: "Ghi chú" },
    { key: "unit", label: "ĐVT" },
    { key: "reductionFactor", label: "Hệ số giảm", align: "center" as const },
    { key: "quantity", label: "Khối lượng", align: "center" as const },
    { key: "materialPrice", label: "Đơn giá vật tư", align: "end" as const },
    { key: "laborPrice", label: "Đơn giá nhân công", align: "end" as const },
    { key: "materialTotal", label: "Thành tiền vật tư", align: "end" as const },
    { key: "laborTotal", label: "Thành tiền nhân công", align: "end" as const },
    { key: "actions", label: "Hoạt động", align: "center" as const },
  ];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "note":
        return <CustomInputField className="min-w-[100px]" />;
      case "reductionFactor":
        return (
          <CustomInputField defaultValue={item.reductionFactor.toString()} />
        );
      case "quantity":
        return <CustomInputField defaultValue={item.quantity.toString()} />;
      case "materialPrice":
      case "laborPrice":
      case "materialTotal":
      case "laborTotal":
        if (!isMounted) return item[columnKey];

        return (item[columnKey] as number).toLocaleString("vi-VN");
      case "actions":
        return (
          <Tooltip closeDelay={0} color="danger" content="Xóa">
            <Button
              isIconOnly
              className="text-danger hover:bg-danger-50 dark:hover:bg-danger-900/10"
              size="sm"
              variant="light"
            >
              <DeleteIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="space-y-4">
      <GenericDataTable
        columns={columns}
        data={materials}
        renderCellAction={renderCell}
        tableProps={{
          className: "pt-0",
        }}
        title="Chi phí vật tư khách hàng thanh toán"
        topContent={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <SearchInputWithButton label="Mã vật tư" />
            <CustomInput label="Khối lượng" />
          </div>
        }
      />

      <div className="flex flex-wrap gap-3 p-4">
        <CustomButton
          className="text-white font-bold ml-auto shadow-md shadow-success/20"
          color="success"
          startContent={<ApprovalIcon className="w-4 h-4" />}
        >
          Hoàn tất dự toán
        </CustomButton>
        <CustomButton
          className="font-bold shadow-md shadow-primary/20"
          color="primary"
          startContent={<DocumentChartIcon className="w-4 h-4" />}
        >
          Báo cáo
        </CustomButton>
      </div>
    </div>
  );
};

export const CustomInputField = ({
  className,
  defaultValue,
}: {
  className?: string;
  defaultValue?: string;
}) => {
  return (
    <Input
      className={className ?? "w-16 mx-auto text-center"}
      defaultValue={defaultValue}
      radius="sm"
      size="sm"
      variant="bordered"
    />
  );
};

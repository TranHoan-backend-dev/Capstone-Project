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
import { EstimateItem, EstimateResponse } from "@/types";
import { ESTIMATE_COLUMN } from "@/config/table-columns";

export const MaterialCostCard = () => {
  const [data, setData] = useState<EstimateItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
          sort: `${sort.field},${sort.direction}`,
        });

        const res = await fetch(
          `/api/construction/estimates?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        setTotalItems(pageData?.totalElements ?? 0);
        setTotalPages(pageData?.totalPages ?? 1);

        const mapped = items.map((item: EstimateResponse, index: number) => ({
          id: item.estimationId,
          stt: (page - 1) * pageSize + index + 1,
          name: item.formCode,
        }));
        setData(mapped);
      } catch (e) {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, sort]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "note":
        return <CustomInputField className="min-w-[100px]" />;
      // case "reductionFactor":
      //   return (
      //     <CustomInputField defaultValue={item.reductionFactor.toString()} />
      //   );
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
        columns={ESTIMATE_COLUMN}
        data={data}
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

"use client";

import { Button, Chip, Tooltip } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DarkGreenChip, DarkRedChip, DeleteIcon } from "@/config/chip-and-icon";
import { BusinessPageRecord } from "@/types";
import { BUSINESS_PAGES_COLUMNS } from "@/config/table-colum";

export const BusinessPageTable = () => {
  const [data, setData] = useState<BusinessPageRecord[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(totalItems / pageSize);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/organization/business-pages?page=${page - 1}&size=${pageSize}`,
        );
        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }
        const json = await res.json();
        const pageData = json?.data;
        const items = json?.data?.items;
        if (!Array.isArray(items)) {
          setData([]);
          return;
        }

        setTotalItems(pageData.totalItems);
        setData(
          items.map((item: any, index: number) => ({
            stt: (page - 1) * pageSize + index + 1,
            id: item.pageId,
            nameBusinessPage: item.name,
            status: item.activate ? "Hoạt động" : "Không hoạt động",
            creator: item.creator,
            updator: item.updator,
          })),
        );
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const actionItems = useMemo(
    () => [
      {
        content: "Xóa",
        icon: DeleteIcon,
        className: "text-red-500 hover:bg-red-50",
        onClick: (id: string) => console.log("Xóa:", id),
      },
    ],
    [],
  );

  const renderCell = (item: BusinessPageRecord, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span>{item.stt}</span>;

      case "nameBusinessPage":
        return <span className="font-semibold">{item.nameBusinessPage}</span>;

      case "status": {
        const isActive = item.status === "Hoạt động";
        if (isActive) {
          return (
            <Chip
              className={DarkGreenChip}
              color="success"
              size="sm"
              variant="flat"
            >
              Hoạt động
            </Chip>
          );
        }
        return (
          <Chip className={DarkRedChip} color="danger" size="sm" variant="flat">
            Không hoạt động
          </Chip>
        );
      }

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
      isLoading={loading}
      title="Danh sách trang doanh nghiệp"
      columns={BUSINESS_PAGES_COLUMNS}
      data={data}
      isCollapsible
      renderCellAction={renderCell}
      headerSummary={`${data.length}`}
      paginationProps={{
        total: totalPages,
        initialPage: page,
        onChange: setPage,
        summary: `${totalItems}`,
      }}
    />
  );
};

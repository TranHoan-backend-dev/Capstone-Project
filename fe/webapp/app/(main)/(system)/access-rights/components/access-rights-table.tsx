"use client";

import { Button, Chip, Tooltip } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DarkGreenChip, DarkRedChip, DeleteIcon } from "@/config/chip-and-icon";
import { AccessRightsRecord } from "@/types";
import { BUSINESS_PAGES_COLUMNS } from "@/config/table-colum";

export const AccessRightsTable = () => {
  const [data, setData] = useState<AccessRightsRecord[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(totalItems / pageSize);
  const [formData, setFormData] = useState({
    page: "",
    size: "",
    isEnabled: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
        });

        if (formData.isEnabled !== "") {
          params.append("isEnabled", formData.isEnabled);
        }

        if (formData.username) {
          params.append("username", formData.username);
        }

        const res = await fetch(
          `/api/auth/authorization/employees?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.items ?? [];

        setTotalItems(pageData.totalItems);

        setData(
          items.map((item: any, index: number) => ({
            id: item.userId,
            stt: (page - 1) * pageSize + index + 1,
            username: item.username,
            fullname: item.fullname,
            businessPage: item.businessPage,
            waterSupplyNetwork: item.waterSupplyNetwork,
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
  }, [page, formData]);

  const renderCell = (item: AccessRightsRecord, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span>{item.stt}</span>;

      case "username":
        return <span className="font-semibold">{item.username}</span>;

      case "fullname":
        return <span className="text-gray-700">{item.fullname}</span>;

      case "businessPage":
        return <span className="text-gray-700">{item.businessPage}</span>;

      case "waterSupplyNetwork":
        return <span className="text-gray-700">{item.waterSupplyNetwork}</span>;

      case "updator":
        return <span className="text-gray-700">{item.updator}</span>;

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

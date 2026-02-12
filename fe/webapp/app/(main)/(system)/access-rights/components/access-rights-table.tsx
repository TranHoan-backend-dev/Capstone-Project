"use client";

import React, { useEffect, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { AccessRightsRecord } from "@/types";
import { ACCESS_RIGHTS_COLUMNS } from "@/config/table-colum";

export const AccessRightsTable = () => {
  const [data, setData] = useState<AccessRightsRecord[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;
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

        const res = await fetch(`/api/auth/employees?${params.toString()}`);

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        const pageInfo = pageData?.page;
        setTotalItems(pageInfo?.totalElements ?? 0);

        setData(
          items.map((item: any, index: number) => ({
            id: item.id,
            stt: (page - 1) * pageSize + index + 1,
            username: item.username,
            fullname: item.fullname,
          })),
        );
      } catch (e) {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
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

      default:
        return (item as any)[columnKey];
    }
  };

  return (
    <GenericDataTable
      isLoading={loading}
      title="Quản lý quyền truy cập"
      columns={ACCESS_RIGHTS_COLUMNS}
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

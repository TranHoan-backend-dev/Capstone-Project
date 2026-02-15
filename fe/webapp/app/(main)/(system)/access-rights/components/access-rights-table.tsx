"use client";

import React, { useEffect, useMemo, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { AccessRightsRecord } from "@/types";
import { ACCESS_RIGHTS_COLUMNS } from "@/config/table-colum";
import { UserPermissionPanel } from "./user-permission-panel";
import { Button, Tooltip } from "@heroui/react";
import { DeleteIcon } from "@/config/chip-and-icon";

interface Props {
  username: string;
}

export const AccessRightsTable = ({ username }: Props) => {
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
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
  } | null>(null);
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

        if (username) {
          params.append("username", username);
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

        const mapped = items.map((item: any, index: number) => ({
          id: item.id,
          stt: (page - 1) * pageSize + index + 1,
          username: item.username,
          fullname: item.fullname,
        }));
        setData(mapped);

        if (username && mapped.length === 1) {
          setSelectedUser({
            id: mapped[0].id,
            username: mapped[0].username,
          });
        }

        if (!username || mapped.length !== 1) {
          setSelectedUser(null);
        }
      } catch (e) {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, formData, username]);

  const handleSelectUser = (item: AccessRightsRecord) => {
    setSelectedUser((prev) =>
      prev?.id === item.id ? null : { id: item.id, username: item.username },
    );
  };

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
  const renderCell = (item: AccessRightsRecord, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span>{item.stt}</span>;

      case "username":
        return (
          <button
            onClick={() => handleSelectUser(item)}
            className="font-semibold text-blue-600 hover:underline"
          >
            {item.username}
          </button>
        );

      case "fullname":
        return (
          <button
            onClick={() => handleSelectUser(item)}
            className="text-gray-700 hover:text-blue-600 hover:underline"
          >
            {item.fullname}
          </button>
        );

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
    <>
      {selectedUser && (
        <UserPermissionPanel
          empId={selectedUser.id}
          username={selectedUser.username}
        />
      )}
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
    </>
  );
};

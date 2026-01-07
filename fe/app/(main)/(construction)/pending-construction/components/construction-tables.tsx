"use client";
import React from "react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { Tooltip, Button, Chip } from "@heroui/react";
import { TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const PendingTable = () => {
  const columns = [
    { key: "id", label: "Mã đơn" },
    { key: "contractNo", label: "Số hợp đồng" },
    { key: "project", label: "Tên công trình" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "date", label: "Ngày đăng ký" },
    { key: "actions", label: "Hành động", align: "center" as const },
  ];

  const mockData = [
    {
      id: "TC-2024-001",
      contractNo: "HD-2024-156",
      project: "Nhà ở gia đình Anh Minh",
      phone: "0912 345 678",
      address: "123 Lê Lợi, P.4, Q.Gò Vấp, TP.HCM",
      date: "15/12/2024",
    },
  ];

  return (
    <GenericDataTable
      title="Danh sách đơn chờ"
      columns={columns}
      data={mockData}
      renderCell={(item: any, key: string) => {
        if (key === "actions") {
          return (
            <div className="flex justify-center gap-2">
              <Tooltip content="Duyệt đơn">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-green-600"
                  onPress={() => console.log("Duyệt:", item.id)}
                >
                  <CheckIcon className="w-5 h-5" />
                </Button>
              </Tooltip>

              <Tooltip content="Từ chối đơn">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-red-500"
                  onPress={() => console.log("Từ chối:", item.id)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </Tooltip>
            </div>
          );
        }

        return (
          <span className={key === "id" ? "text-blue-600 font-bold" : ""}>
            {item[key]}
          </span>
        );
      }}
      tableProps={{ selectionMode: "multiple" }}
    />
  );
};

export const ApprovedTable = () => {
  const columns = [
    { key: "id", label: "Mã đơn" },
    { key: "contractNo", label: "Số hợp đồng" },
    { key: "project", label: "Tên công trình" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt" },
    { key: "date", label: "Ngày đăng ký" },
    { key: "actions", label: "Hành động", align: "center" as const },
  ];

  const mockData = [
    {
      id: "TC-2024-006",
      contractNo: "HD-2024-156",
      project: "Nhà ở gia đình Anh Minh",
      phone: "0901 234 567",
      address: "12 Trần Hưng Đạo, P.5, Q.5, TP.HCM",
      date: "10/12/2024",
    },
  ];

  return (
    <GenericDataTable
      title="Danh sách đơn cho phép thi công"
      headerSummary="3"
      columns={columns}
      data={mockData}
      renderCell={(item: any, key: string) => {
        if (key === "actions") {
          return (
            <Tooltip content="Xóa">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          );
        }

        return (
          <span className={key === "id" ? "text-blue-600 font-bold" : ""}>
            {item[key]}
          </span>
        );
      }}
    />
  );
};

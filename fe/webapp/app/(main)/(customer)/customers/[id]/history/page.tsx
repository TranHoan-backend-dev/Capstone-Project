"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Chip, Tooltip, Button } from "@heroui/react";
import Link from "next/link";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  BlueYellowIconColor,
  DarkGreenChip,
  GreenIconColor,
  ProfileIcon,
  SetPriceIcon,
  UsageIcon,
} from "@/config/chip-and-icon";

const ConsumptionHistoryPage = () => {
  const params = useParams();
  const { id } = params;

  // Mock data matching the image
  const historyData = Array.from({ length: 19 }, (_, i) => {
    const month = 12 - (i % 12);
    const year = 2025 - Math.floor(i / 12);

    return {
      id: i + 1,
      customerCode: "000123",
      period: `${month}/${year}`,
      route: "01C495",
      customerName: "Nguyễn Song Hoàn",
      address: "2f9b TTĐ, Hoàng Diệu, Phường Nam Định", // Added address for better look
      status: "Bình thường",
      priceInfo: "Thông tin áp giá",
      consumption: "Tiêu thụ",
      profile: "Xem hồ sơ",
    };
  });

  const columns = [
    { key: "no", label: "#" },
    { key: "customerCode", label: "Mã khách hàng" },
    { key: "period", label: "Kỳ" },
    { key: "route", label: "Lộ trình ghi" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "address", label: "Địa chỉ" },
    { key: "status", label: "Tình trạng" },
    { key: "priceInfo", label: "Bảng giá", align: "center" as const },
    { key: "consumption", label: "Lịch sử tiêu thụ", align: "center" as const },
    { key: "profile", label: "Hồ sơ", align: "center" as const },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "no":
        return <span>{item.id}</span>;
      case "status":
        return (
          <Chip
            className={`font-bold ${DarkGreenChip}`}
            color="success"
            size="sm"
            variant="flat"
          >
            {item.status}
          </Chip>
        );
      case "priceInfo":
        return (
          <div className="flex justify-center">
            <Tooltip closeDelay={0} color="primary" content="Thông tin áp giá">
              <Button isIconOnly size="sm" variant="light">
                <SetPriceIcon className={BlueYellowIconColor} />
              </Button>
            </Tooltip>
          </div>
        );
      case "consumption":
        return (
          <div className="flex justify-center">
            <Tooltip closeDelay={0} color="success" content="Tiêu thụ">
              <Button isIconOnly size="sm" variant="light">
                <UsageIcon className={GreenIconColor} />
              </Button>
            </Tooltip>
          </div>
        );
      case "profile":
        return (
          <div className="flex justify-center">
            <Tooltip closeDelay={0} color="secondary" content="Xem hồ sơ">
              <Button
                isIconOnly
                as={Link}
                href={`/customers/${id}`}
                size="sm"
                variant="light"
              >
                <ProfileIcon className={BlueYellowIconColor} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="space-y-6 pt-2 pb-8">
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Tra cứu khách hàng", href: "/customers" },
          { label: "Lịch sử tiêu thụ", isCurrent: true },
        ]}
      />

      <GenericDataTable
        columns={columns}
        data={historyData}
        headerSummary={`${historyData.length}`}
        isCollapsible={false}
        paginationProps={{
          total: 10,
          initialPage: 1,
          summary: `1-20 của ${historyData.length}`,
        }}
        renderCellAction={renderCell}
        title={`Lịch sử tiêu thụ - Khách hàng: 000123 - Nguyễn Song Hoàn`}
      />
    </div>
  );
};

export default ConsumptionHistoryPage;

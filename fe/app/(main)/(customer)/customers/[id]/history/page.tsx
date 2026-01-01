"use client";

import React from "react";
import { useParams } from "next/navigation";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { Chip, Tooltip, Button } from "@heroui/react";
import { BlueYellowIconColor, DarkGreenChip, GreenIconColor, ProfileIcon, SetPriceIcon, UsageIcon } from "@/config/chip-and-icon";
import Link from "next/link";

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
            profile: "Xem hồ sơ"
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
                    <Chip size="sm" color="success" variant="flat" className={`font-bold ${DarkGreenChip}`}>
                        {item.status}
                    </Chip>
                );
            case "priceInfo":
                return (
                    <div className="flex justify-center">
                        <Tooltip content="Thông tin áp giá" color="primary" closeDelay={0}>
                            <Button isIconOnly variant="light" size="sm">
                                <SetPriceIcon className={BlueYellowIconColor} />
                            </Button>
                        </Tooltip>
                    </div>
                );
            case "consumption":
                return (
                    <div className="flex justify-center">
                        <Tooltip content="Tiêu thụ" color="success" closeDelay={0}>
                            <Button isIconOnly variant="light" size="sm">
                                <UsageIcon className={GreenIconColor} />
                            </Button>
                        </Tooltip>
                    </div>
                );
            case "profile":
                return (
                    <div className="flex justify-center">
                        <Tooltip content="Xem hồ sơ" color="secondary" closeDelay={0}>
                            <Button as={Link} href={`/customers/${id}`} isIconOnly variant="light" size="sm" >
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
                title={`Lịch sử tiêu thụ - Khách hàng: 000123 - Nguyễn Song Hoàn`}
                data={historyData}
                columns={columns}
                renderCell={renderCell}
                isCollapsible={false}
                paginationProps={{
                    total: 10,
                    initialPage: 1,
                    summary: `1-20 của ${historyData.length}`,
                }}
                headerSummary={`${historyData.length}`}
            />
        </div>
    );
};

export default ConsumptionHistoryPage;

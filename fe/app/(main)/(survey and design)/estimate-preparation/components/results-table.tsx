"use client";

import React from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DarkGreenChip, DarkRedChip, EstimationIcon, GreenIconColor } from "@/config/chip-and-icon";
import { EstimateItem } from "@/types";

interface ResultsTableProps {
    data: EstimateItem[];
}

const statusMap = {
    pending_estimate: {
        label: "Chờ lập dự toán",
        color: "success" as const,
        bg: DarkGreenChip,
    },
    rejected: {
        label: "Chưa được phê duyệt",
        color: "danger" as const,
        bg: DarkRedChip,
    },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
    const columns = [
        { key: "stt", label: "STT", width: "60px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
        { key: "registerDate", label: "Ngày đăng ký" },
        { key: "status", label: "Trạng thái đơn" },
        { key: "actions", label: "Hoạt động", align: "center" as const },
    ];

    const baseStyle = "text-gray-500 dark:text-default-500"

    const renderCell = (item: EstimateItem, columnKey: string) => {
        switch (columnKey) {
            case "stt":
                return <span className="text-black dark:text-white">{data.indexOf(item) + 1}</span>;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-[#2a66e4] dark:text-primary underline underline-offset-4 hover:text-blue-800 dark:hover:text-primary-600">
                        {item.code}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900 dark:text-foreground">{item.customerName}</span>;
            case "phone":
                return <span className={`${baseStyle}`}>{item.phone}</span>;
            case "address":
                return <span className={`${baseStyle}`}>{item.address}</span>;
            case "registerDate":
                return <span className={`${baseStyle}`}>{item.registerDate}</span>;
            case "status":
                const config = statusMap[item.status];
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        className={`${config.bg}`}
                        color={config.color}
                    >
                        {config.label}
                    </Chip>
                );
            case "actions":
                return (
                    <Tooltip content="Chạy dự toán" color="success" closeDelay={0}>
                        <Button
                            isIconOnly
                            as={NextLink}
                            href="/estimate-preparation"
                            variant="light"
                            size="sm"
                        >
                            <EstimationIcon className={GreenIconColor} />
                        </Button>
                    </Tooltip>
                );
            default:
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Danh sách lập dự toán"
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: "1-5 của 25"
            }}
        />
    );
};

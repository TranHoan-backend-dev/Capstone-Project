"use client";

import React from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DarkGreenChip, DarkRedChip } from "@/config/chip.cl";
import { CalculatorIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface SettlementTableProps {
    data: any[];
}

export const ResultsTable = ({ data }: SettlementTableProps) => {
    const columns = [
        { key: "no", label: "#", width: "40px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt" },
        { key: "registerDate", label: "Ngày đăng ký" },
        { key: "status", label: "Trạng thái đơn" },
        { key: "actions", label: "Hoạt động", align: "center" as const },
    ];

    const renderCell = (item: any, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof any];

        switch (columnKey) {
            case "no":
                return <span className="font-medium text-black dark:text-white">{data.indexOf(item) + 1}</span>;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800 dark:text-primary dark:hover:text-primary-600">
                        {cellValue}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900 dark:text-foreground">{cellValue}</span>;
            case "status":
                return (
                    <Chip
                        variant="flat"
                        size="sm"
                        color={
                            cellValue === "Đã duyệt dự toán"
                                ? "success"
                                : "danger"
                        }
                        className={
                            cellValue === "Đã duyệt dự toán"
                                ? `border-none font-medium px-2 ${DarkGreenChip}`
                                : `border-none font-medium px-2 ${DarkRedChip}`
                        }
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                const actions = [
                    { content: "Quyết toán", icon: CalculatorIcon, className: "text-blue-600 dark:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30" },
                    { content: "Chỉnh sửa", icon: PencilSquareIcon, className: "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30" },
                ];
                return (
                    <div className="flex justify-center items-center gap-1">
                        {actions.map((action, idx) => (
                            <Tooltip key={idx} content={action.content} closeDelay={0} color={idx % 2 == 0 ? "primary" : "warning"}>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    className={action.className}
                                >
                                    <action.icon className="w-5 h-5" />
                                </Button>
                            </Tooltip>
                        ))}
                    </div>
                );
            default:
                return <span className="text-gray-600 dark:text-default-600">{cellValue}</span>;
        }
    };

    return (
        <GenericDataTable
            title="Danh sách quyết toán"
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            headerSummary={`${data.length}`}
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: `1-5 của 25`
            }}
        />
    );
};

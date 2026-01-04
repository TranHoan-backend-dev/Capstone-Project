"use client";

import React from "react";
import { Link, Chip, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { BlueYellowIconColor, DarkGreenChip, DarkYellowChip, DeleteIcon, PrintReceiptIcon, RedIconColor } from "@/config/chip-and-icon";

interface RelatedOrdersTableProps {
    data: any[];
}

export const RelatedOrdersTable = ({ data }: RelatedOrdersTableProps) => {
    const columns = [
        { key: "no", label: "#", width: "40px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt" },
        { key: "createdDate", label: "Ngày tạo" },
        { key: "status", label: "Trạng thái", align: "center" as const },
        { key: "actions", label: "Thao tác", align: "center" as const },
    ];

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-black dark:text-white">{data.indexOf(item) + 1}</span>;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 dark:text-primary hover:underline">
                        {item.code}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900 dark:text-foreground">{item.customerName}</span>;
            case "status":
                if (item.status === "completed") {
                    return (
                        <Chip variant="flat" color="success" size="sm" className={`font-bold ${DarkGreenChip}`}>
                            Hoàn thành
                        </Chip>
                    );
                }
                return (
                    <Chip variant="flat" color="warning" size="sm" className={`font-bold ${DarkYellowChip}`}>
                        Đang lắp đặt
                    </Chip>
                );
            case "actions":
                const actionButtons = [
                    { content: "In biên nhận", icon: PrintReceiptIcon, className: BlueYellowIconColor },
                    { content: "Xóa", icon: DeleteIcon, className: RedIconColor, color: "danger" as const },
                ];
                return (
                    <div className="flex items-center gap-2 justify-center">
                        {actionButtons.map((action, idx) => (
                            <Tooltip key={idx} content={action.content} color={action.color} closeDelay={0}>
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
                return item[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Danh sách đơn liên quan"
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            headerSummary={`${data.length}`}
            paginationProps={{
                total: 1,
                initialPage: 1,
                onChange: (page) => console.log(page),
                summary: `${data.length}`
            }}
        />
    );
};

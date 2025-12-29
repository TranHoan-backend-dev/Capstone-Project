"use client";

import React from "react";
import { Link, Chip, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import { PrinterIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface RelatedOrdersTableProps {
    data: any[];
}

export const RelatedOrdersTable = ({ data }: RelatedOrdersTableProps) => {
    const columns = [
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
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline">
                        {item.code}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900">{item.customerName}</span>;
            case "status":
                if (item.status === "completed") {
                    return (
                        <Chip variant="flat" color="success" size="sm" className="font-bold">
                            Hoàn thành
                        </Chip>
                    );
                }
                return (
                    <Chip variant="flat" color="warning" size="sm" className="font-bold">
                        Đang lắp đặt
                    </Chip>
                );
            case "actions":
                const actionButtons = [
                    { content: "In biên nhận", icon: PrinterIcon, className: "text-blue-600 hover:bg-blue-50" },
                    { content: "Xóa", icon: TrashIcon, className: "text-danger hover:bg-danger-50", color: "danger" as const },
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

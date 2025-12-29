"use client";

import React from "react";
import { Chip, Link, Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import {
    BanknotesIcon,
    ChartBarIcon,
    ArrowPathRoundedSquareIcon,
    ClockIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface Customer {
    id: number;
    customerCode: string;
    oldCustomerCode: string;
    number: string;
    customerName: string;
    address: string;
    status: string;
}

interface ResultsTableProps {
    data: Customer[];
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
    const columns = [
        { key: "no", label: "#" },
        { key: "customerCode", label: "Mã KH" },
        { key: "oldCustomerCode", label: "Mã KH cũ" },
        { key: "number", label: "Số" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "address", label: "Địa chỉ" },
        { key: "status", label: "Tình trạng" },
        { key: "actions", label: "Thao tác", align: "center" as const },
    ];

    const renderCell = (item: Customer, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
            case "customerCode":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800">
                        {item.customerCode}
                    </Link>
                );
            case "oldCustomerCode":
                return <span className="font-medium text-gray-500">{item.oldCustomerCode}</span>;
            case "customerName":
                return <span className="font-bold text-gray-900">{item.customerName}</span>;
            case "status":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        className="bg-[#dcfce7] text-[#15803d] font-bold px-3 py-1 border-none rounded-full"
                    >
                        {item.status}
                    </Chip>
                );
            case "actions":
                const actionsItems = [
                    { content: "Áp giá", icon: BanknotesIcon, className: "text-blue-600 hover:bg-blue-50", href: "#" },
                    { content: "Tiêu thụ", icon: ChartBarIcon, className: "text-green-600 hover:bg-green-50", href: "#" },
                    { content: "Thay ĐH", icon: ArrowPathRoundedSquareIcon, className: "text-amber-500 hover:bg-amber-50", href: "#" },
                    { content: "Lịch sử", icon: ClockIcon, className: "text-gray-600 hover:bg-gray-100", href: "#" },
                    { content: "Hồ sơ", icon: UserCircleIcon, className: "text-indigo-600 hover:bg-indigo-50", href: "#" },
                ];
                return (
                    <div className="flex items-center justify-center gap-1">
                        {actionsItems.map((action, idx) => (
                            <Tooltip key={idx} content={action.content} closeDelay={0}>
                                <Button
                                    isIconOnly
                                    as={NextLink}
                                    href={action.href}
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
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Kết quả tìm kiếm"
            icon={
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
                    </svg>
                </div>
            }
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            paginationProps={{
                total: 1,
                initialPage: 1,
                summary: `${data.length}`,
            }}
            headerSummary={`${data.length}`}
        />
    );
};

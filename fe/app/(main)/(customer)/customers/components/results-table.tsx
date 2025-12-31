"use client";

import React from "react";
import { Chip, Link, Tooltip, Button, useDisclosure } from "@heroui/react";
import NextLink from "next/link";
import {
    BanknotesIcon,
    ChartBarIcon,
    ArrowPathRoundedSquareIcon,
    ClockIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DarkBlueChip, DarkGreenChip, DarkRedChip, DarkYellowChip } from "@/config/chip.cl";
import { PriceApplicationModal } from "./price-application-modal";

import { MeterChangeHistoryModal } from "./meter-change-history-modal";

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

const statusConfig: Record<string, { className: string }> = {
    "Bình thường": {
        className: `bg-green-100 text-green-700 ${DarkGreenChip}`,
    },
    "Chờ duyệt": {
        className: `bg-blue-100 text-blue-700 ${DarkBlueChip}`,
    },
    "Tạm ngưng": {
        className: `bg-amber-100 text-amber-700 ${DarkYellowChip}`,
    },
    "Đã khóa": {
        className: `bg-red-100 text-red-700 ${DarkRedChip}`,
    },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
    const { isOpen: isPriceOpen, onOpen: onPriceOpen, onOpenChange: onPriceOpenChange } = useDisclosure();
    const { isOpen: isMeterOpen, onOpen: onMeterOpen, onOpenChange: onMeterOpenChange } = useDisclosure();

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

    const actionsItems = (id: number) => [
        { content: "Áp giá", icon: BanknotesIcon, className: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30", onPress: onPriceOpen },
        { content: "Tiêu thụ", icon: ChartBarIcon, className: "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30", href: "#" },
        { content: "Thay ĐH", icon: ArrowPathRoundedSquareIcon, className: "text-amber-500 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30", onPress: onMeterOpen },
        { content: "Lịch sử", icon: ClockIcon, className: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800", href: `/customers/${id}/history` },
        { content: "Hồ sơ", icon: UserCircleIcon, className: "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30", href: `/customers/${id}` },
    ];

    const renderCell = (item: Customer, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-black dark:text-white">{data.indexOf(item) + 1}</span>;
            case "customerCode":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800 dark:text-primary dark:hover:text-primary-400">
                        {item.customerCode}
                    </Link>
                );
            case "oldCustomerCode":
                return <span className="font-medium text-gray-500 dark:text-default-500">{item.oldCustomerCode}</span>;
            case "customerName":
                return <span className="font-bold text-gray-900 dark:text-foreground">{item.customerName}</span>;
            case "status":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        className={`${statusConfig[item.status].className} font-bold px-3 py-1 border-none rounded-full`}
                    >
                        {item.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-1">
                        {actionsItems(item.id).map((action, idx) => (
                            <Tooltip key={idx} content={action.content} closeDelay={0}>
                                <Button
                                    isIconOnly
                                    as={action.href ? NextLink : "button"}
                                    href={action.href}
                                    onPress={action.onPress}
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
        <>
            <GenericDataTable
                title="Kết quả tìm kiếm"
                icon={
                    <div className="p-2 bg-blue-50 dark:bg-primary-500/10 rounded-lg text-blue-600 dark:text-primary">
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
            <PriceApplicationModal isOpen={isPriceOpen} onOpenChange={onPriceOpenChange} />
            <MeterChangeHistoryModal isOpen={isMeterOpen} onOpenChange={onMeterOpenChange} />
        </>
    );
};

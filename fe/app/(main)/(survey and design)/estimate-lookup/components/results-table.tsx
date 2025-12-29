"use client";

import React from "react";
import { Chip, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { CalculatorIcon, PencilSquareIcon, FolderIcon } from "@heroicons/react/24/solid";

interface EstimateItem {
    id: number;
    code: string;
    name: string;
    phone: string;
    address: string;
    date: string;
    status: "approved" | "pending_approval" | "pending_estimate" | "redo";
}

interface ResultsTableProps {
    data: EstimateItem[];
}

const statusMap = {
    approved: {
        label: "Đã duyệt dự toán",
        color: "success" as const,
        bg: "bg-green-100",
        text: "text-green-700",
    },
    pending_approval: {
        label: "Chờ duyệt dự toán",
        color: "primary" as const,
        bg: "bg-blue-100",
        text: "text-blue-700",
    },
    pending_estimate: {
        label: "Chờ lập dự toán",
        color: "default" as const,
        bg: "bg-gray-100",
        text: "text-gray-700",
    },
    redo: {
        label: "Lập lại dự toán",
        color: "danger" as const,
        bg: "bg-red-100",
        text: "text-red-700",
    },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
    const columns = [
        { key: "no", label: "#" },
        { key: "code", label: "Mã đơn" },
        { key: "name", label: "Tên thiết kế" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt" },
        { key: "date", label: "Ngày đăng ký" },
        { key: "status", label: "Trạng thái đơn" },
        { key: "actions", label: "Hoạt động", align: "center" as const },
    ];

    const renderCell = (item: EstimateItem, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800">
                        {item.code}
                    </Link>
                );
            case "name":
                return <span className="font-bold text-gray-900">{item.name}</span>;
            case "status":
                const config = statusMap[item.status];
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        className={`${config.bg} ${config.text} border-none font-medium px-2`}
                    >
                        {config.label}
                    </Chip>
                );
            case "actions":
                const actionButtons = [
                    { content: "Dự toán", color: "success" as const, icon: CalculatorIcon, href: "#", className: "text-green-600 hover:text-green-700" },
                    { content: "Chỉnh sửa", color: "warning" as const, icon: PencilSquareIcon, href: "#", className: "text-amber-500 hover:text-amber-600" },
                    { content: "Hồ sơ", color: "primary" as const, icon: FolderIcon, href: "#", className: "text-blue-600 hover:text-blue-800" },
                ];

                return (
                    <div className="flex items-center justify-center gap-5">
                        {actionButtons.map((btn, idx) => (
                            <Tooltip key={idx} content={btn.content} color={btn.color}>
                                <Link as={NextLink} href={btn.href} className={`${btn.className} transition-transform hover:scale-110`}>
                                    <btn.icon className="w-6 h-6" />
                                </Link>
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
            title="Danh sách đơn thiết kế"
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: `${data.length}`
            }}
            headerSummary={`${data.length}`}
        />
    );
};

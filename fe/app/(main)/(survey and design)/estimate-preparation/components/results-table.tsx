"use client";

import React from "react";
import { Chip, Link, Checkbox } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface EstimateItem {
    id: number;
    code: string;
    customerName: string;
    phone: string;
    address: string;
    registerDate: string;
    status: "pending_estimate" | "rejected";
}

interface ResultsTableProps {
    data: EstimateItem[];
}

const statusMap = {
    pending_estimate: {
        label: "Chờ lập dự toán",
        bg: "bg-[#e2f2ea]",
        text: "text-[#10a345]",
    },
    rejected: {
        label: "Chưa được phê duyệt",
        bg: "bg-[#ffe4e4]",
        text: "text-[#ff0000]",
    },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
    const columns = [
        { key: "selection", label: <Checkbox size="sm" radius="sm" className="ml-1" />, width: "40px" },
        { key: "stt", label: "STT", width: "60px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
        { key: "registerDate", label: "Ngày đăng ký" },
        { key: "status", label: "Trạng thái đơn" },
        { key: "actions", label: "Hoạt động", align: "center" as const },
    ];

    const renderCell = (item: EstimateItem, columnKey: string) => {
        switch (columnKey) {
            case "selection":
                return <Checkbox size="sm" radius="sm" className="ml-1" />;
            case "stt":
                return <span className="text-gray-400 font-medium ml-1">{data.indexOf(item) + 1}</span>;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-[#2a66e4] underline underline-offset-4 hover:text-blue-800">
                        {item.code}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900">{item.customerName}</span>;
            case "phone":
                return <span className="text-gray-500">{item.phone}</span>;
            case "address":
                return <span className="text-gray-500 text-xs leading-relaxed inline-block max-w-[280px]">{item.address}</span>;
            case "registerDate":
                return <span className="text-gray-500">{item.registerDate}</span>;
            case "status":
                const config = statusMap[item.status];
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        className={`${config.bg} ${config.text} border-none font-bold px-4 py-3 h-auto`}
                        radius="md"
                    >
                        {config.label}
                    </Chip>
                );
            case "actions":
                return (
                    <Link
                        as={NextLink}
                        href="#"
                        className="text-[#2a66e4] font-bold text-xs underline underline-offset-4"
                    >
                        Chạy dự toán
                    </Link>
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

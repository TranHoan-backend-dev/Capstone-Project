"use client";

import React from "react";
import { TrashIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { Checkbox, Link } from "@heroui/react";
import NextLink from "next/link";
import { FolderIcon } from "@heroicons/react/24/solid";

interface ProcessedDesignsTableProps {
    data: any[];
}

export const ProcessedDesignsTable = ({ data }: ProcessedDesignsTableProps) => {
    const columns: any[] = [
        { key: "selection", label: <Checkbox size="sm" radius="sm" className="ml-1" />, width: "40px" },
        { key: "stt", label: "STT", align: "center", width: "60px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
        { key: "registrationDate", label: "Ngày đăng ký" },
        { key: "surveyAppointment", label: "Ngày hẹn khảo sát" },
        { key: "activities", label: "Hoạt động", align: "center" },
        { key: "docs", label: "Hồ sơ", align: "center" },
    ];

    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "selection":
                return <Checkbox size="sm" radius="sm" className="ml-1" />;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800">
                        {cellValue}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900">{cellValue}</span>;
            case "activities":
                return (
                    <div className="flex justify-center">
                        <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors" />
                    </div>
                );
            case "docs":
                return (
                    <div className="flex justify-center">
                        <FolderIcon className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors" />
                    </div>
                );
            case "stt":
                return <span className="text-gray-400">{cellValue}</span>;
            default:
                return cellValue;
        }
    };

    return (
        <GenericDataTable
            title="Danh sách đã xử lý đơn đã thiết kế"
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

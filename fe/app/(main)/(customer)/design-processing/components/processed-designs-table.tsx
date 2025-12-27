"use client";

import React from "react";
import { TrashIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface ProcessedDesignsTableProps {
    data: any[];
}

export const ProcessedDesignsTable = ({ data }: ProcessedDesignsTableProps) => {
    const columns: any[] = [
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
            case "code":
                return <span className="text-blue-600 font-bold">{cellValue}</span>;
            case "activities":
                return (
                    <div className="flex justify-center">
                        <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors" />
                    </div>
                );
            case "docs":
                return (
                    <div className="flex justify-center">
                        <DocumentDuplicateIcon className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors" />
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
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: "Hiển thị 1-5 của 25 kết quả"
            }}
        />
    );
};

"use client";

import React from "react";
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
        { key: "no", label: "#", align: "center", width: "60px" },
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
                    <div className="flex justify-center items-center gap-4">
                        <div className="text-[#ff4d4f] font-bold group p-1 hover:underline cursor-pointer">
                            Từ chối
                        </div>
                        <div className="text-[#ff4d4f] font-bold group p-1 hover:underline cursor-pointer">
                            Xóa
                        </div>
                    </div>
                );
            case "docs":
                return (
                    <div className="flex justify-center">
                        <FolderIcon className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors" />
                    </div>
                );
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
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

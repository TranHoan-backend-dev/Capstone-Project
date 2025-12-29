"use client";

import React from "react";
import { Chip, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

interface WaitingInputTableProps {
    data: any[];
    onRestore?: (item: any) => void;
}

export const WaitingInputTable = ({ data, onRestore }: WaitingInputTableProps) => {
    const columns: any[] = [
        { key: "stt", label: "#", align: "center", width: "60px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
        { key: "registrationDate", label: "Ngày đăng ký" },
        { key: "surveyAppointment", label: "Ngày hẹn khảo sát" },
        { key: "status", label: "Trạng thái", align: "center" },
        { key: "action", label: "Hoạt động", align: "center" },
    ];

    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800">
                        {cellValue}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900">{cellValue}</span>;
            case "status":
                if (cellValue === "pending_restore") {
                    return (
                        <Chip variant="flat" color="success" size="sm" className="font-bold">
                            Chờ khôi phục
                        </Chip>
                    );
                }
                if (cellValue === "rejected") {
                    return (
                        <Chip variant="flat" color="danger" size="sm" className="font-bold">
                            Từ chối
                        </Chip>
                    );
                }
                if (cellValue === "none") {
                    return (
                        <Chip variant="flat" color="default" size="sm" className="font-bold bg-gray-100 text-gray-400">
                            Không có
                        </Chip>
                    );
                }
                return cellValue;
            case "action":
                return (
                    <div className="flex justify-center">
                        <Tooltip content="Khôi phục" color="primary">
                            <ArrowPathIcon
                                className="w-6 h-6 text-blue-600 cursor-pointer hover:rotate-180 transition-transform duration-500"
                                onClick={() => onRestore?.(item)}
                            />
                        </Tooltip>
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
            title="Danh sách đang chờ đầu vào & từ chối thiết kế"
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

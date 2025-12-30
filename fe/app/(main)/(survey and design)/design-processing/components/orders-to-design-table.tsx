"use client";

import React from "react";
import { Chip, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { DarkBlueChip, DarkGreenChip } from "@/config/chip.cl";

interface OrdersToDesignTableProps {
    data: any[];
    onApprove?: (item: any) => void;
}

export const OrdersToDesignTable = ({ data, onApprove }: OrdersToDesignTableProps) => {
    const columns: any[] = [
        { key: "no", label: "#", align: "center", width: "60px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
        { key: "registrationDate", label: "Ngày đăng ký" },
        { key: "surveyAppointment", label: "Ngày hẹn khảo sát" },
        { key: "status", label: "Trạng thái đơn", align: "center" },
        { key: "activities", label: "Hoạt động", align: "center" },
    ];

    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "no":
                return <span className="font-medium text-black dark:text-white">{data.indexOf(item) + 1}</span>;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800 dark:text-primary dark:hover:text-primary-600">
                        {cellValue}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900 dark:text-foreground">{cellValue}</span>;
            case "status":
                if (cellValue === "paid") {
                    return (
                        <Chip variant="flat" color="success" size="sm" className={`font-bold ${DarkGreenChip}`}>
                            Đã thu tiền
                        </Chip>
                    );
                }
                if (cellValue === "processing") {
                    return (
                        <Chip variant="flat" color="secondary" size="sm" className={`font-bold ${DarkBlueChip}`}>
                            Đang xử lý
                        </Chip>
                    );
                }
                return cellValue;
            case "activities":
                return (
                    <div className="flex justify-center">
                        <Tooltip content="Duyệt" color="success">
                            <CheckCircleIcon
                                className="w-6 h-6 cursor-pointer text-green-500 dark:text-success hover:text-green-600 transition-colors"
                                onClick={() => onApprove?.(item)}
                            />
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    };


    return (
        <GenericDataTable
            title="Danh sách đơn chờ thiết kế"
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

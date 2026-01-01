"use client";

import React from "react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";
import { DeleteIcon, ProfileIcon, RejectIcon, RedIconColor, BlueYellowIconColor } from "@/config/chip-and-icon";

interface ProcessedDesignsTableProps {
    data: any[];
    onReject?: (item: any) => void;
}

export const ProcessedDesignsTable = ({ data, onReject }: ProcessedDesignsTableProps) => {
    const columns: any[] = [
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
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800 dark:text-primary dark:hover:text-primary-600">
                        {cellValue}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900 dark:text-foreground">{cellValue}</span>;
            case "activities":
                return (
                    <div className="flex justify-center items-center gap-5">
                        <Tooltip content="Từ chối" color="danger">
                            <RejectIcon className={RedIconColor} onClick={() => onReject?.(item)} />
                        </Tooltip>
                        <Tooltip content="Xóa" color="danger">
                            <DeleteIcon className={RedIconColor} />
                        </Tooltip>
                    </div>
                );
            case "docs":
                return (
                    <div className="flex justify-center">
                        <ProfileIcon className={BlueYellowIconColor} />
                    </div>
                );
            case "no":
                return <span className="font-medium text-black dark:text-white">{data.indexOf(item) + 1}</span>;
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

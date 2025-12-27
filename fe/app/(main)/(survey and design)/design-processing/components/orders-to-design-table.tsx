"use client";

import React from "react";
import { Checkbox, Chip, Link } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface OrdersToDesignTableProps {
    data: any[];
}

export const OrdersToDesignTable = ({ data }: OrdersToDesignTableProps) => {
    const columns: any[] = [
        { key: "selection", label: <Checkbox size="sm" radius="sm" className="ml-1" />, width: "40px" },
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
            case "selection":
                return <Checkbox size="sm" radius="sm" className="ml-1" />;
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
            case "code":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-800">
                        {cellValue}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900">{cellValue}</span>;
            case "status":
                if (cellValue === "paid") {
                    return (
                        <Chip variant="flat" color="success" size="sm" className="font-bold">
                            Đã thu tiền
                        </Chip>
                    );
                }
                if (cellValue === "processing") {
                    return (
                        <Chip variant="flat" color="secondary" size="sm" className="bg-blue-100 text-blue-700 font-bold">
                            Đang xử lý
                        </Chip>
                    );
                }
                return cellValue;
            case "activities":
                return (
                    <div className="flex justify-center">
                        <Link
                            href="#"
                            className="text-[#10a345] font-bold text-[13px] hover:underline"
                        >
                            Duyệt
                        </Link>
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

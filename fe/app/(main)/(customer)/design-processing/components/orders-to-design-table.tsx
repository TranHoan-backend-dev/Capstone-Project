"use client";

import React from "react";
import { Chip } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface OrdersToDesignTableProps {
    data: any[];
}

export const OrdersToDesignTable = ({ data }: OrdersToDesignTableProps) => {
    const columns: any[] = [
        { key: "stt", label: "STT", align: "center", width: "60px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
        { key: "registrationDate", label: "Ngày đăng ký" },
        { key: "surveyAppointment", label: "Ngày hẹn khảo sát" },
        { key: "status", label: "Trạng thái đơn", align: "center" },
    ];

    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "code":
                return <span className="text-blue-600 font-bold">{cellValue}</span>;
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
            case "stt":
                return <span className="text-gray-400">{cellValue}</span>;
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
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: "Hiển thị 1-5 của 25 kết quả"
            }}
        />
    );
};

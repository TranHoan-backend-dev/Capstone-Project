"use client";

import React from "react";
import { Checkbox, Chip, Link } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface WaitingInputTableProps {
    data: any[];
}

export const WaitingInputTable = ({ data }: WaitingInputTableProps) => {
    const columns: any[] = [
        { key: "selection", label: <Checkbox size="sm" radius="sm" className="ml-1" />, width: "40px" },
        { key: "stt", label: "STT", align: "center", width: "60px" },
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
            case "selection":
                return <Checkbox size="sm" radius="sm" className="ml-1" />;
            case "code":
                return <span className="text-blue-600 font-bold">{cellValue}</span>;
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
                    <Link href="#" className="text-blue-600 font-bold text-sm hover:underline">
                        Khôi phục
                    </Link>
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

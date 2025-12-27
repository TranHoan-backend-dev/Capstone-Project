"use client";

import React from "react";
import { Chip, Link } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface SettlementTableProps {
    data: any[];
}

export const ResultsTable = ({ data }: SettlementTableProps) => {
    const columns = [
        { key: "no", label: "#", width: "40px" },
        { key: "code", label: "Mã đơn" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "phone", label: "Điện thoại" },
        { key: "address", label: "Địa chỉ lắp đặt" },
        { key: "registerDate", label: "Ngày đăng ký" },
        { key: "status", label: "Trạng thái đơn" },
        { key: "actions", label: "Hoạt động", align: "center" as const },
    ];

    const renderCell = (item: any, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof any];

        switch (columnKey) {
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
            case "code":
                return <span className="text-blue-600 font-bold">{cellValue}</span>;
            case "customerName":
                return <span className="font-semibold text-gray-800">{cellValue}</span>
            case "status":
                return (
                    <Chip
                        variant="flat"
                        size="sm"
                        className={
                            cellValue === "Đã duyệt dự toán"
                                ? "bg-[#e2f2ea] text-[#10a345] border-none font-medium px-2"
                                : "bg-[#ffeceb] text-[#ff4d4f] border-none font-medium px-2"
                        }
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="flex justify-center gap-3">
                        <Link href="#" className="text-blue-600 text-sm hover:underline">
                            Quyết toán
                        </Link>
                        <Link href="#" className="text-blue-600 text-sm hover:underline">
                            Chỉnh sửa
                        </Link>
                    </div>
                );
            default:
                return <span className="text-gray-600">{cellValue}</span>;
        }
    };

    return (
        <GenericDataTable
            title="Danh sách quyết toán"
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            headerSummary={`${data.length}`}
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: `1-5 của 25`
            }}
        />
    );
};

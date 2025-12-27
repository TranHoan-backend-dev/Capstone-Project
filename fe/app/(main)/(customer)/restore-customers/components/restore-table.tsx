"use client";

import React from "react";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface RestoreItem {
    id: number;
    customerCode: string;
    customerName: string;
    address: string;
    restoreDate: string;
    period: string;
    reason: string;
}

interface RestoreTableProps {
    data: RestoreItem[];
}

export const RestoreTable = ({ data }: RestoreTableProps) => {
    const columns = [
        { key: "no", label: "#", width: "40px" },
        { key: "customerCode", label: "Mã KH" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "address", label: "Địa chỉ" },
        { key: "restoreDate", label: "Ngày Khôi Phục" },
        { key: "period", label: "Kỳ Khôi Phục" },
        { key: "reason", label: "Lý Do Khôi Phục" },
    ];

    const renderCell = (item: RestoreItem, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
            case "customerCode":
                return <span className="font-bold text-blue-600">{item.customerCode}</span>;
            case "customerName":
                return <span className="font-semibold text-gray-800">{item.customerName}</span>;
            case "address":
                return <div className="max-w-[200px] truncate">{item.address}</div>;
            case "restoreDate":
                return <span className="text-gray-400 text-[12px]">{item.restoreDate}</span>;
            case "period":
                return (
                    <span className="font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-100/50">
                        {item.period}
                    </span>
                );
            case "reason":
                return <div className="text-gray-500 italic max-w-[250px] truncate">{item.reason}</div>;
            default:
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Danh Sách KH Khôi Phục"
            icon={
                <div className="p-2 bg-blue-50 rounded-lg text-[#2563eb]">
                    <TableCellsIcon className="w-4 h-4" />
                </div>
            }
            columns={columns}
            data={data}
            renderCell={renderCell}
            paginationProps={{
                total: 1,
                initialPage: 1,
                summary: `${data.length}`
            }}
            headerSummary={`${data.length}`}
            tableProps={{
                classNames: {
                    th: "bg-[#fcfdfe] text-gray-400 font-bold py-3 px-4 border-b border-gray-100 text-[10px] uppercase tracking-widest text-left",
                    td: "py-2.5 px-4 text-[13px] text-gray-600 border-b border-gray-50 last:border-none",
                }
            }}
        />
    );
};

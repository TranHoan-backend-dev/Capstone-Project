"use client";

import React from "react";
import { Chip, Link } from "@heroui/react";
import NextLink from "next/link";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface Customer {
    id: number;
    customerCode: string;
    oldCustomerCode: string;
    number: string;
    customerName: string;
    address: string;
    status: string;
}

interface ResultsTableProps {
    data: Customer[];
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
    const columns = [
        { key: "no", label: "#" },
        { key: "customerCode", label: "Mã KH" },
        { key: "oldCustomerCode", label: "Mã KH cũ" },
        { key: "number", label: "Số" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "address", label: "Địa chỉ" },
        { key: "status", label: "Tình trạng" },
        { key: "actions", label: "Thao tác", align: "center" as const },
    ];

    const renderCell = (item: Customer, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
            case "customerCode":
                return <span className="font-bold text-gray-900">{item.customerCode}</span>;
            case "oldCustomerCode":
                return <span className="font-medium text-gray-500">{item.oldCustomerCode}</span>;
            case "customerName":
                return <span className="font-semibold text-gray-800">{item.customerName}</span>;
            case "status":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        className="bg-[#dcfce7] text-[#15803d] font-bold px-3 py-1 border-none rounded-full"
                    >
                        {item.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-2.5 text-[5px] whitespace-nowrap">
                        <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                            Bảng giá
                        </Link>
                        <span className="text-gray-200 font-normal">|</span>
                        <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                            Tiêu thụ
                        </Link>
                        <span className="text-gray-200 font-normal">|</span>
                        <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                            Thay ĐH
                        </Link>
                        <span className="text-gray-200 font-normal">|</span>
                        <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                            Lịch sử
                        </Link>
                        <span className="text-gray-200 font-normal">|</span>
                        <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                            Hồ sơ
                        </Link>
                    </div>
                );
            default:
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Kết quả tìm kiếm"
            icon={
                <div className="p-2 bg-blue-50 rounded-lg text-[#2563eb]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
                    </svg>
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
                    th: "bg-[#fcfdfe] text-gray-400 font-bold py-4 px-4 border-b border-gray-100 text-[11px] uppercase tracking-widest",
                }
            }}
        />
    );
};

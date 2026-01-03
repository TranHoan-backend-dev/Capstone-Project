"use client";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
    DocumentMagnifyingGlassIcon,
    PrinterIcon,
} from "@heroicons/react/24/outline";
import { Button, Tooltip } from "@heroui/react";
import NextLink from "next/link";

interface ContractRecord {
    id: string;
    contractNo: string;
    name: string;
    address: string;
    date: string;
}

export const ContractTable = () => {
    // 1. Định nghĩa cột bám sát mockup
    const columns = [
        { key: "id", label: "Mã đơn" },
        { key: "contractNo", label: "Số hợp đồng" },
        { key: "name", label: "Tên khách hàng" },
        { key: "address", label: "Địa chỉ chi tiết" },
        { key: "date", label: "Ngày giao TC" },
        { key: "actions", label: "Hoạt động", align: "center" as const },
    ];

    // 2. Cấu hình các icon thao tác (giống mẫu bạn gửi)
    const actionItems = [
        { 
            content: "In biên nhận", 
            icon: PrinterIcon, 
            className: "text-blue-600 hover:bg-blue-50", 
            href: "#" 
        },
        { 
            content: "Xem hồ sơ", 
            icon: DocumentMagnifyingGlassIcon, 
            className: "text-indigo-600 hover:bg-indigo-50", 
            href: "#" 
        },
    ];

    // 3. Dữ liệu mẫu bám sát mockup
    const mockData: ContractRecord[] = [
        {
            id: "01025070073",
            contractNo: "VXU3348",
            name: "Bùi Thị Hồng Oanh",
            address: "7/74 Vị Xuyên, TP. Nam Định",
            date: "20/07/2025",
        },
        // Thêm các dòng khác tại đây...
    ];

    const renderCell = (item: ContractRecord, columnKey: string) => {
        switch (columnKey) {
            case "id":
                return <span className="font-medium">{item.id}</span>;
            case "name":
                return <span className="font-bold text-gray-900">{item.name}</span>;
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-2">
                        {actionItems.map((action, idx) => (
                            <Tooltip key={idx} content={action.content} closeDelay={0}>
                                <Button
                                    isIconOnly
                                    as={NextLink}
                                    href={action.href}
                                    variant="light"
                                    size="sm"
                                    className={`${action.className} rounded-lg`}
                                >
                                    <action.icon className="w-5 h-5" />
                                </Button>
                            </Tooltip>
                        ))}
                    </div>
                );
            default:
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="DANH SÁCH HỒ SƠ"
            columns={columns}
            data={mockData}
            renderCell={renderCell}
            isCollapsible={false}
            paginationProps={{
                total: 3,
                initialPage: 1,
                summary: `${mockData.length}`,
            }}
            headerSummary={`${mockData.length}`}
        />
    );
};
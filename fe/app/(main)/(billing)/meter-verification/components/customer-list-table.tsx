"use client";

import React from "react";
import { Checkbox, Button } from "@heroui/react";
import { CameraIcon } from "@heroicons/react/24/solid";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface CustomerRecord {
    id: number;
    code: string;
    name: string;
    oldReadDate: string;
    readDate: string;
    oldIndex: number;
    newIndex: number;
    volume: number;
    isCut: boolean;
}

interface CustomerListTableProps {
    data: CustomerRecord[];
}

export const CustomerListTable = ({ data }: CustomerListTableProps) => {
    const columns = [
        { key: "#", label: "#", width: "50px", align: "center" as const },
        { key: "code", label: "Mã KH" },
        { key: "name", label: "Tên khách hàng", width: "150px" },
        { key: "oldReadDate", label: "Ngày ghi cũ" },
        { key: "readDate", label: "Ngày ghi" },
        { key: "oldIndex", label: "Chỉ số cũ", align: "center" as const },
        { key: "newIndex", label: "Chỉ số mới", align: "center" as const },
        { key: "volume", label: "Khối lượng", align: "center" as const },
        { key: "isCut", label: "Cúp", align: "center" as const },
        { key: "image", label: "Ảnh", align: "center" as const },
    ];

    const renderCell = (item: CustomerRecord, columnKey: string) => {
        switch (columnKey) {
            case "#":
                return <span className="text-gray-500 dark:text-white">{data.indexOf(item) + 1}</span>;
            case "code":
                return <span className="font-bold text-gray-800 dark:text-white">{item.code}</span>;
            case "name":
                return <span className="text-gray-900 dark:text-white">{item.name}</span>;
            case "oldReadDate":
                return <span className="text-gray-500 dark:text-white">{item.oldReadDate}</span>;
            case "readDate":
                return <span className="text-gray-500 dark:text-white">{item.readDate}</span>;
            case "oldIndex":
                return <span className="text-gray-600 dark:text-white">{item.oldIndex}</span>;
            case "newIndex":
                return <span className="text-gray-600 dark:text-white">{item.newIndex}</span>;
            case "volume":
                return <span className="text-gray-600 dark:text-white font-medium">{item.volume}</span>;
            case "isCut":
                return <Checkbox size="sm" radius="sm" isSelected={item.isCut} isDisabled className="dark:opacity-70" />;
            case "image":
                return (
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-blue-500 dark:text-primary"
                    >
                        <CameraIcon className="w-5 h-5" />
                    </Button>
                );
            default:
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Danh sách khách hàng"
            columns={columns}
            data={data}
            renderCell={renderCell}
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: "Hiển thị 1-5 của 25 kết quả",
            }}
        />
    );
};

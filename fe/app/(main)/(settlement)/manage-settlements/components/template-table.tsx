"use client";

import React from "react";
import { Checkbox, Link, Button } from "@heroui/react";
import NextLink from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

interface MaterialTemplate {
    id: number;
    code: string;
    name: string;
    createdAt: string;
}

interface TemplateTableProps {
    data: MaterialTemplate[];
}

export const TemplateTable = ({ data }: TemplateTableProps) => {
    const columns = [
        { key: "selection", label: <Checkbox size="sm" radius="sm" className="ml-1" />, width: "40px" },
        { key: "no", label: "STT", align: "center" as const, width: "60px" },
        { key: "code", label: "Mã mẫu" },
        { key: "name", label: "Tên mẫu bốc vật tư" },
        { key: "createdAt", label: "Ngày tạo" },
        { key: "activities", label: "Thao tác", align: "center" as const },
    ];

    const renderCell = (item: MaterialTemplate, columnKey: string) => {
        switch (columnKey) {
            case "selection":
                return <Checkbox size="sm" radius="sm" className="ml-1" />;
            case "no":
                return <span className="font-medium text-gray-400">{data.indexOf(item) + 1}</span>;
            case "code":
                return <span className="text-gray-600">{item.code}</span>;
            case "name":
                return <span className="text-gray-900">{item.name}</span>;
            case "createdAt":
                return <span className="text-gray-500">{item.createdAt}</span>;
            case "activities":
                return (
                    <div className="flex justify-center items-center gap-3">
                        <Link
                            as={NextLink}
                            href="#"
                            className="text-[#2a66e4] font-bold text-[13px] hover:underline"
                        >
                            Bốc vật tư
                        </Link>
                        <Link
                            as={NextLink}
                            href="#"
                            className="text-[#2a66e4] font-bold text-[13px] hover:underline"
                        >
                            Sửa
                        </Link>
                        <Link
                            as={NextLink}
                            href="#"
                            className="text-[#2a66e4] font-bold text-[13px] hover:underline"
                        >
                            Xóa
                        </Link>
                    </div>
                );
            default:
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Danh sách mẫu vật tư"
            headerSummary={`${data.length}`}
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            actions={<></>}
            paginationProps={{
                total: 5,
                initialPage: 1,
                summary: `1-${data.length} của 25`
            }}
        />
    );
};

"use client";

import React from "react";
import { Tooltip, Button } from "@heroui/react";
import NextLink from "next/link";
import {
    PencilSquareIcon,
    TrashIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
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
        { key: "no", label: "STT", align: "center" as const, width: "60px" },
        { key: "code", label: "Mã mẫu" },
        { key: "name", label: "Tên mẫu bốc vật tư" },
        { key: "createdAt", label: "Ngày tạo" },
        { key: "activities", label: "Thao tác", align: "center" as const },
    ];

    const renderCell = (item: MaterialTemplate, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-black dark:text-white">{data.indexOf(item) + 1}</span>;
            case "code":
                return <span className="text-gray-600 dark:text-white">{item.code}</span>;
            case "name":
                return <span className="text-gray-900 dark:text-white">{item.name}</span>;
            case "createdAt":
                return <span className="text-gray-500 dark:text-white">{item.createdAt}</span>;
            case "activities":
                const actions = [
                    { content: "Bốc vật tư", icon: ClipboardDocumentListIcon, className: "text-blue-600 dark:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/10", color: "primary" as const, href: "#" },
                    { content: "Sửa", icon: PencilSquareIcon, className: "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10", color: "warning" as const, href: "#" },
                    { content: "Xóa", icon: TrashIcon, className: "text-danger hover:bg-danger-50 dark:hover:bg-danger-900/10", color: "danger" as const, href: "#" },
                ];
                return (
                    <div className="flex justify-center items-center gap-2">
                        {actions.map((action, idx) => (
                            <Tooltip key={idx} content={action.content} color={action.color} closeDelay={0}>
                                <Button
                                    isIconOnly
                                    as={NextLink}
                                    href={action.href}
                                    variant="light"
                                    size="sm"
                                    className={action.className}
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

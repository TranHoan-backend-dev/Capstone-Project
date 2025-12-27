"use client";

import React from "react";
import {
    Card,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    TableProps,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CustomPagination } from "./CustomPagination";

interface Column {
    key: string;
    label: string | React.ReactNode;
    align?: "start" | "center" | "end";
    width?: string;
}

interface GenericDataTableProps<T> {
    title: string;
    icon?: React.ReactNode;
    columns: Column[];
    data: T[];
    renderCell: (item: T, columnKey: string) => React.ReactNode;
    paginationProps?: {
        total: number;
        initialPage: number;
        onChange?: (page: number) => void;
        summary?: string;
    };
    tableProps?: Partial<TableProps>;
    isCollapsible?: boolean;
    defaultOpen?: boolean;
    headerSummary?: string;
}

export const GenericDataTable = <T extends { id: string | number }>({
    title,
    icon,
    columns,
    data,
    renderCell,
    paginationProps,
    tableProps,
    isCollapsible = false,
    defaultOpen = true,
    headerSummary,
}: GenericDataTableProps<T>) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <Card shadow="sm" className="border-none rounded-xl overflow-hidden bg-white transition-all duration-300">
            <CardBody className="p-0">
                <div
                    className={`border-b border-gray-100 transition-colors ${isCollapsible ? "hover:bg-gray-50/50" : ""}`}
                >
                    <div
                        role={isCollapsible ? "button" : undefined}
                        onClick={() => isCollapsible && setIsOpen(!isOpen)}
                        className={`p-6 flex justify-between items-center ${isCollapsible ? "cursor-pointer select-none" : ""}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-blue-600">
                                {icon}
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            {headerSummary && (
                                <div className="hidden md:block px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-500 whitespace-nowrap">
                                    Tìm thấy {headerSummary} bản ghi
                                </div>
                            )}
                            {isCollapsible && (
                                <div className="text-gray-400">
                                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "opacity-100 max-h-[5000px] visible" : "opacity-0 max-h-0 invisible"}`}>
                    <div className="overflow-x-auto">
                        <Table
                            aria-label={title}
                            removeWrapper
                            classNames={{
                                th: "bg-[#fcfdfe] text-gray-400 font-bold py-4 px-4 border-b border-gray-100 text-[11px] uppercase tracking-widest",
                                td: "py-4 px-4 text-sm text-gray-600 border-b border-gray-50 last:border-none",
                                ...tableProps?.classNames,
                            }}
                            {...tableProps}
                        >
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn
                                        key={column.key}
                                        align={column.align || "start"}
                                        style={column.width ? { width: column.width } : {}}
                                    >
                                        {column.label}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={data}>
                                {(item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        {(columnKey) => (
                                            <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {paginationProps && (
                        <CustomPagination
                            total={paginationProps.total}
                            initialPage={paginationProps.initialPage}
                            onChange={paginationProps.onChange}
                            summary={paginationProps.summary}
                        />
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

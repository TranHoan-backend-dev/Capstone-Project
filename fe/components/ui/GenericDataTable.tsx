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
    headerRight?: React.ReactNode;
}

export const GenericDataTable = <T extends { id: string | number }>({
    title,
    icon,
    columns,
    data,
    renderCell,
    paginationProps,
    tableProps,
    headerRight,
}: GenericDataTableProps<T>) => {
    return (
        <Card shadow="sm" className="border-none rounded-xl overflow-hidden bg-white">
            <CardBody className="p-0">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-blue-600">
                        {icon}
                        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    </div>
                    {headerRight}
                </div>

                <div className="overflow-x-auto">
                    <Table
                        aria-label={title}
                        removeWrapper
                        classNames={{
                            th: "bg-gray-50/50 text-gray-500 font-bold py-4 px-4 border-b border-gray-100 text-xs",
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
            </CardBody>
        </Card>
    );
};

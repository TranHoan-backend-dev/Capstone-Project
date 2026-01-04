"use client"

import { Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import React from 'react';
import { CustomPagination } from '../custom/CustomPagination';
import BaseModal, { BaseModalProps } from './BaseModal';

export interface CellElements {
    elements: string[]
}

interface ModalProps extends Omit<BaseModalProps, "children"> {
    isHavingSearchField?: boolean;
    tableColumns: string[];
    data: any[];
    topContent?: React.ReactNode;
    isPagination?: boolean; // đổi lại khi có pagination, đổi thành số bản ghi
}

const CustomModalWithTable = ({
    isOpen,
    onOpenChange,
    isHavingSearchField,
    title,
    topContent,
    tableColumns,
    data,
    size = "3xl",
    isPagination,
    className
}: ModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title || "Chọn từ danh sách lộ trình"}
            size={size}
            className={className}
        >
            {topContent && <div className="mb-4">{topContent}</div>}

            {isHavingSearchField ?? (
                <div className="flex items-center gap-4 mb-4 justify-center">
                    <Input
                        variant="bordered"
                        placeholder="Tìm kiếm"
                        radius="sm"
                        size="sm"
                        className="max-w-[400px]"
                        classNames={{
                            inputWrapper: "h-8 border-[#ccc] dark:border-divider min-h-unit-8",
                        }}
                    />
                </div>
            )}

            <div className="overflow-hidden">
                <Table
                    aria-label="Route list table"
                    removeWrapper
                    classNames={{
                        th: "bg-[#eef2f8] dark:bg-default-100 text-[#555] dark:text-default-600 font-bold text-[13px] h-9 py-0",
                        td: "py-2 text-[13px] group-hover:bg-[#f5f8ff] dark:group-hover:bg-default-50/50 cursor-pointer",
                        tr: "hover:bg-[#f5f8ff] dark:hover:bg-default-50 transition-colors",
                    }}
                >
                    <TableHeader>
                        {tableColumns.map((col, idx) => (
                            <TableColumn key={idx}>{col}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {data.map((items, idx) => (
                            <TableRow key={idx}>
                                {items && (Array.isArray(items) ? items : (items as any).elements)?.map((item: any, cellIdx: number) => (
                                    <TableCell key={cellIdx}>{item}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isPagination && (
                <div className="mt-4">
                    <CustomPagination
                        total={49}
                        initialPage={1}
                        summary="1-10 của 481"
                    />
                </div>
            )}
        </BaseModal>
    );
};

export default CustomModalWithTable;
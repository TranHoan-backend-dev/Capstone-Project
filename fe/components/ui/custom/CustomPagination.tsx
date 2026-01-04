"use client";

import React from "react";
import { Pagination, PaginationProps } from "@heroui/react";

interface CustomPaginationProps extends PaginationProps {
    summary?: string;
}

export const CustomPagination = ({ summary, ...props }: CustomPaginationProps) => {
    return (

        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-divider bg-content1">
            <div className="text-sm text-default-500">
                Hiển thị {summary || "1-5 của 25"} kết quả
            </div>
            <Pagination
                {...props}
                size="md"
                radius="lg"
                variant="flat"
                classNames={{
                    cursor: "bg-primary text-white shadow-lg shadow-primary/30",
                    item: "bg-content1 border border-divider text-default-400 font-bold h-9 w-9 min-w-9",
                    prev: "bg-content1 border border-divider text-default-400 font-bold hover:bg-default-100 h-9 w-9 min-w-9",
                    next: "bg-content1 border border-divider text-default-400 font-bold hover:bg-default-100 h-9 w-9 min-w-9",
                    ...props.classNames,
                }}
                showControls
            />
        </div>
    );
};

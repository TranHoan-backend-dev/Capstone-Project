"use client";

import React from "react";
import { Pagination, PaginationProps } from "@heroui/react";

interface CustomPaginationProps extends PaginationProps {
}

export const CustomPagination = (props: CustomPaginationProps) => {
    return (
        <Pagination
            {...props}
            size="md"
            radius="lg"
            variant="flat"
            classNames={{
                cursor: "bg-[#2563eb] text-white shadow-lg shadow-blue-100",
                item: "bg-white border border-gray-100 text-gray-400 font-bold h-9 w-9 min-w-9",
                prev: "bg-white border border-gray-100 text-gray-400 font-bold hover:bg-gray-50 h-9 w-9 min-w-9",
                next: "bg-white border border-gray-100 text-gray-400 font-bold hover:bg-gray-50 h-9 w-9 min-w-9",
                ...props.classNames,
            }}
            showControls
        />
    );
};

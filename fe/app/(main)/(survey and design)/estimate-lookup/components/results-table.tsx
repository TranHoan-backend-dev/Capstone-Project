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
    Chip,
    Link,
} from "@heroui/react";
import NextLink from "next/link";
import { CustomPagination } from "@/components/ui/CustomPagination";

interface EstimateItem {
    id: number;
    code: string;
    name: string;
    phone: string;
    address: string;
    date: string;
    status: "approved" | "pending_approval" | "pending_estimate" | "redo";
}

interface ResultsTableProps {
    data: EstimateItem[];
}

const statusMap = {
    approved: {
        label: "Đã duyệt dự toán",
        color: "success" as const,
        bg: "bg-green-100",
        text: "text-green-700",
    },
    pending_approval: {
        label: "Chờ duyệt dự toán",
        color: "primary" as const,
        bg: "bg-blue-100",
        text: "text-blue-700",
    },
    pending_estimate: {
        label: "Chờ lập dự toán",
        color: "default" as const,
        bg: "bg-gray-100",
        text: "text-gray-700",
    },
    redo: {
        label: "Lập lại dự toán",
        color: "danger" as const,
        bg: "bg-red-100",
        text: "text-red-700",
    },
};

export const ResultsTable = ({ data }: ResultsTableProps) => {
    const renderStatus = (status: EstimateItem["status"]) => {
        const config = statusMap[status];
        return (
            <Chip
                size="sm"
                variant="flat"
                className={`${config.bg} ${config.text} border-none font-medium px-2`}
            >
                {config.label}
            </Chip>
        );
    };

    return (
        <Card shadow="sm" className="border-none rounded-xl overflow-hidden bg-white">
            <CardBody className="p-0">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Danh sách đơn thiết kế</h2>
                </div>

                <div className="overflow-x-auto">
                    <Table
                        aria-label="Estimate search results"
                        removeWrapper
                        classNames={{
                            th: "bg-gray-50/50 text-gray-500 font-bold py-4 px-4 border-b border-gray-100 text-xs",
                            td: "py-4 px-4 text-sm text-gray-600 border-b border-gray-50 last:border-none",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="code">Mã đơn</TableColumn>
                            <TableColumn key="name">Tên thiết kế</TableColumn>
                            <TableColumn key="phone">Điện thoại</TableColumn>
                            <TableColumn key="address">Địa chỉ lắp đặt</TableColumn>
                            <TableColumn key="date">Ngày đăng ký</TableColumn>
                            <TableColumn key="status">Trạng thái đơn</TableColumn>
                            <TableColumn key="actions" align="center">Hoạt động</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-bold text-blue-600">{item.code}</TableCell>
                                    <TableCell className="font-medium text-gray-800">{item.name}</TableCell>
                                    <TableCell>{item.phone}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{renderStatus(item.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-3 text-xs font-semibold">
                                            <Link as={NextLink} href="#" className="text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline">
                                                Dự toán
                                            </Link>
                                            <Link as={NextLink} href="#" className="text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline">
                                                Chỉnh sửa
                                            </Link>
                                            <Link as={NextLink} href="#" className="text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline">
                                                Hồ sơ
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <CustomPagination
                    total={5}
                    initialPage={1}
                />
            </CardBody>
        </Card>
    );
};

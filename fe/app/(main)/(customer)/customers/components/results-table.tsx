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

interface Customer {
    id: number;
    customerCode: string;
    oldCustomerCode: string;
    number: string;
    customerName: string;
    address: string;
    status: string;
}

interface ResultsTableProps {
    data: Customer[];
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
    return (
        <Card shadow="sm" className="border-none rounded-2xl overflow-hidden">
            <CardBody className="p-0">
                <div className="p-5 flex justify-between items-center border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-[#2563eb]">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-gray-800">Kết quả tìm kiếm</h2>
                    </div>
                    <div className="px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-500">
                        Tìm thấy <span className="text-[#2563eb] font-bold">{data.length}</span> kết quả
                    </div>
                </div>

                <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-50/50 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-all">
                    <Table
                        aria-label="Customer search results"
                        removeWrapper
                        classNames={{
                            th: "bg-[#fcfdfe] text-gray-400 font-bold py-4 px-4 border-b border-gray-100 text-[11px] uppercase tracking-widest",
                            td: "py-3 px-4 text-[14px] text-gray-600 border-b border-gray-50 last:border-none",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="no">#</TableColumn>
                            <TableColumn key="customerCode">Mã KH</TableColumn>
                            <TableColumn key="oldCustomerCode">Mã KH cũ</TableColumn>
                            <TableColumn key="number">Số</TableColumn>
                            <TableColumn key="customerName">Tên khách hàng</TableColumn>
                            <TableColumn key="address">Địa chỉ</TableColumn>
                            <TableColumn key="status">Tình trạng</TableColumn>
                            <TableColumn key="actions" align="center">
                                Thao tác
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors cursor-default">
                                    <TableCell className="font-medium text-gray-400">{index + 1}</TableCell>
                                    <TableCell className="font-bold text-gray-900">{item.customerCode}</TableCell>
                                    <TableCell className="font-medium text-gray-500">{item.oldCustomerCode}</TableCell>
                                    <TableCell className="text-gray-500">{item.number}</TableCell>
                                    <TableCell className="font-semibold text-gray-800">{item.customerName}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className="bg-[#dcfce7] text-[#15803d] font-bold px-3 py-1 border-none rounded-full"
                                        >
                                            {item.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2.5 text-[9px] font-bold whitespace-nowrap">
                                            <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                                                Bảng giá
                                            </Link>
                                            <span className="text-gray-200">|</span>
                                            <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                                                Tiêu thụ
                                            </Link>
                                            <span className="text-gray-200">|</span>
                                            <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                                                Thay ĐH
                                            </Link>
                                            <span className="text-gray-200">|</span>
                                            <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
                                                Lịch sử
                                            </Link>
                                            <span className="text-gray-200">|</span>
                                            <Link as={NextLink} href="#" className="text-[#2563eb] hover:text-blue-800 underline-offset-4 hover:underline">
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
                    total={1}
                    initialPage={1}
                />
            </CardBody>
        </Card>
    );
};

"use client";

import React from "react";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { CustomPagination } from "@/components/ui/CustomPagination";

interface RestoreItem {
    id: number;
    customerCode: string;
    customerName: string;
    address: string;
    restoreDate: string;
    period: string;
    reason: string;
}

interface RestoreTableProps {
    data: RestoreItem[];
}

export const RestoreTable = ({ data }: RestoreTableProps) => {
    return (
        <Card shadow="sm" className="border-none rounded-xl overflow-hidden">
            <CardBody className="p-0">
                <div className="p-4 flex items-center gap-3 border-b border-gray-50 bg-[#fcfdfe]">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#2563eb]">
                        <TableCellsIcon className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold tracking-tight text-gray-800">Danh Sách KH Khôi Phục</h2>
                    <div className="ml-auto px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase">
                        {data.length} Bản ghi
                    </div>
                </div>

                <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-50/50 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-all">
                    <Table
                        aria-label="Restore customer list"
                        removeWrapper
                        classNames={{
                            th: "bg-[#fcfdfe] text-gray-400 font-bold py-3 px-4 border-b border-gray-100 text-[10px] uppercase tracking-widest text-left",
                            td: "py-2.5 px-4 text-[13px] text-gray-600 border-b border-gray-50 last:border-none",
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="no" width={40}>#</TableColumn>
                            <TableColumn key="customerCode">Mã KH</TableColumn>
                            <TableColumn key="customerName">Tên khách hàng</TableColumn>
                            <TableColumn key="address">Địa chỉ</TableColumn>
                            <TableColumn key="restoreDate">Ngày Khôi Phục</TableColumn>
                            <TableColumn key="period">Kỳ Khôi Phục</TableColumn>
                            <TableColumn key="reason">Lý Do Khôi Phục</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium text-gray-400">{index + 1}</TableCell>
                                    <TableCell className="font-bold text-blue-600">{item.customerCode}</TableCell>
                                    <TableCell className="font-semibold text-gray-800">{item.customerName}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{item.address}</TableCell>
                                    <TableCell className="text-gray-400 text-[12px]">{item.restoreDate}</TableCell>
                                    <TableCell>
                                        <span className="font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-100/50">
                                            {item.period}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-500 italic max-w-[250px] truncate">
                                        {item.reason}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <CustomPagination total={1} initialPage={1} />
            </CardBody>
        </Card>
    );
};

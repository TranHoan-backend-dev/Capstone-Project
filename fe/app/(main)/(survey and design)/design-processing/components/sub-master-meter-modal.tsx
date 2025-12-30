"use client";

import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
} from "@heroui/react";
import { FunnelIcon, ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

import { CustomPagination } from "@/components/ui/CustomPagination";

interface SubMasterMeterModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export const SubMasterMeterModal = ({ isOpen, onOpenChange }: SubMasterMeterModalProps) => {
    const data = [
        { id: "01C701", code: "01C701", name: "195", branch: "B600m", location: "Thành phố Nam Định" },
        { id: "01C701A", code: "01C701A", name: "195 (CQ)", branch: "B600m", location: "Thành phố Nam Định" },
        { id: "01D001", code: "01D001", name: "14", branch: "A300", location: "Thành phố Nam Định" },
        { id: "01D001A", code: "01D001A", name: "14CQ", branch: "A300", location: "Thành phố Nam Định" },
        { id: "01D002", code: "01D002", name: "13", branch: "A300", location: "Thành phố Nam Định" },
        { id: "01D003", code: "01D003", name: "07V", branch: "A300", location: "Thành phố Nam Định" },
        { id: "01D004", code: "01D004", name: "08V", branch: "A300", location: "Thành phố Nam Định" },
        { id: "01D026", code: "01D026", name: "10V", branch: "A300", location: "Thành phố Nam Định" },
        { id: "01D027", code: "01D027", name: "06V", branch: "A300", location: "Thành phố Nam Định" },
        { id: "01D028", code: "01D028", name: "172", branch: "A300", location: "Thành phố Nam Định" },
    ];


    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            radius="sm"
            classNames={{
                header: "bg-gradient-to-b from-[#f9f9f9] to-[#ececec] dark:from-default-100 dark:to-default-50 py-2 px-4 min-h-[40px] border-b border-divider",
                body: "p-4",
                closeButton: "top-2 right-2 text-black dark:text-foreground hover:bg-gray-200 dark:hover:bg-default-200 p-1 rounded-sm",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <span className="text-[14px] font-bold text-[#333] dark:text-foreground">Chọn từ danh sách đồng hồ tổng</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex items-center gap-4 mb-4 justify-center">
                                <Input
                                    variant="bordered"
                                    placeholder="Tìm kiếm"
                                    radius="sm"
                                    size="sm"
                                    className="max-w-[400px]"
                                    classNames={{
                                        inputWrapper: "h-8 border-[#ccc] dark:border-divider min-unit-8",
                                    }}
                                />
                            </div>

                            <div className="overflow-hidden">
                                <Table
                                    aria-label="Sub Master Meter table"
                                    removeWrapper
                                    classNames={{
                                        th: "bg-[#eef2f8] dark:bg-default-100 text-[#555] dark:text-default-600 font-bold text-[13px] h-9 py-0",
                                        td: "py-2 text-[13px] group-hover:bg-[#f5f8ff] dark:group-hover:bg-default-50/50 cursor-pointer",
                                        tr: "hover:bg-[#f5f8ff] dark:hover:bg-default-50 transition-colors",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>Mã ĐHT</TableColumn>
                                        <TableColumn>Tên ĐHT</TableColumn>
                                        <TableColumn>Nhánh tổng</TableColumn>
                                        <TableColumn>Chi nhánh</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-bold text-blue-700 dark:text-primary text-[13px]">{item.code}</TableCell>
                                                <TableCell className="text-foreground text-[13px]">{item.name}</TableCell>
                                                <TableCell className="text-default-600 text-[13px]">{item.branch}</TableCell>
                                                <TableCell className="text-default-600 text-[13px]">{item.location}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mt-4">
                                <CustomPagination
                                    total={27}
                                    initialPage={1}
                                    summary="1-10 của 267"
                                />
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

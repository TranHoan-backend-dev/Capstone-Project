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
} from "@heroui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { CustomPagination } from "@/components/ui/CustomPagination";

interface RouteListModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export const RouteListModal = ({ isOpen, onOpenChange }: RouteListModalProps) => {
    const data = [
        { id: "01C059", code: "01C059", name: "108-111-112e", branch: "Thành phố Nam Định" },
        { id: "01C060", code: "01C060", name: "108-111-112f", branch: "Thành phố Nam Định" },
        { id: "01C061", code: "01C061", name: "108-111-112g", branch: "Thành phố Nam Định" },
        { id: "01C080", code: "01C080", name: "06Va", branch: "Thành phố Nam Định" },
        { id: "01C081", code: "01C081", name: "06Vb", branch: "Thành phố Nam Định" },
        { id: "01C082", code: "01C082", name: "29Va", branch: "Thành phố Nam Định" },
        { id: "01C083", code: "01C083", name: "29Vb", branch: "Thành phố Nam Định" },
        { id: "01C084", code: "01C084", name: "29Vc", branch: "Thành phố Nam Định" },
        { id: "01C085", code: "01C085", name: "31Va", branch: "Thành phố Nam Định" },
        { id: "01C086", code: "01C086", name: "31Vb", branch: "Thành phố Nam Định" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            radius="sm"
            classNames={{
                header: "bg-gradient-to-b from-[#f9f9f9] to-[#ececec] py-2 px-4 min-h-[40px]",
                body: "p-4",
                closeButton: "top-2 right-2 text-black hover:bg-gray-200 p-1 rounded-sm",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <span className="text-[14px] font-bold text-[#333]">Chọn từ danh sách lộ trình</span>
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
                                        inputWrapper: "h-8 border-[#ccc] min-h-unit-8",
                                    }}
                                />
                            </div>

                            <div className="overflow-hidden">
                                <Table
                                    aria-label="Route list table"
                                    removeWrapper
                                    classNames={{
                                        th: "bg-[#eef2f8] text-[#555] font-bold text-[13px] h-9 py-0",
                                        td: "py-2 text-[13px] group-hover:bg-[#f5f8ff] cursor-pointer",
                                        tr: "hover:bg-[#f5f8ff] transition-colors",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>Mã ĐP</TableColumn>
                                        <TableColumn>Tên sổ ghi</TableColumn>
                                        <TableColumn>Chi nhánh</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-bold text-blue-700">{item.code}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.branch}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mt-4">
                                <CustomPagination
                                    total={49}
                                    initialPage={1}
                                    summary="1-10 của 481"
                                />
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

'use client'

import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import React from 'react'
import { DarkGreenChip } from '@/config/chip-and-icon';

const CustomerInformation = () => {
    return (
        <Card shadow="sm" className="border-none rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
            <CardBody className="p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-6 flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Thông Tin Khách Hàng</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Tên khách hàng</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-zinc-200">Nguyễn Thị Minh Hạnh</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Địa chỉ</p>
                                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">123 Đường Lê Lợi, Phường 1, Quận 1, TP. HCM</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Mã khách hàng</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-zinc-200 tracking-tight">KH-2024-001234</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Trạng thái</p>
                                <Chip
                                    color="success"
                                    variant="flat"
                                    size="sm"
                                    className={`font-bold border-none px-2 ${DarkGreenChip}`}
                                    startContent={<div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-white mr-1" />}
                                >
                                    Đang hoạt động
                                </Chip>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 shrink-0">
                        <Button
                            className="bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 font-bold px-6 h-11 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 border-none"
                            startContent={<PencilSquareIcon className="w-4 h-4" />}
                        >
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default CustomerInformation;
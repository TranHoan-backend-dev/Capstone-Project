"use client";

import React from "react";
import { Card, CardBody, Input, Button, DatePicker } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { FunnelIcon } from "@heroicons/react/24/outline";

export const FilterSection = () => {
    return (
        <Card shadow="sm" className="border-none rounded-xl bg-white">
            <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-6 text-blue-600">
                    <SearchIcon size={20} />
                    <h2 className="text-lg font-bold tracking-tight text-gray-800">Tra cứu dự toán</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
                    <div className="md:col-span-6 space-y-1">
                        <label className="text-sm font-medium text-gray-600 ml-1">Từ khóa</label>
                        <Input
                            placeholder="Nhập từ khóa tìm kiếm"
                            variant="bordered"
                            radius="md"
                            size="md"
                            classNames={{
                                inputWrapper: "bg-white border-gray-200 hover:border-blue-400 focus-within:!border-blue-500 transition-all shadow-sm h-11",
                                input: "text-sm",
                            }}
                        />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                        <label className="text-sm font-medium text-gray-600 ml-1">Từ ngày</label>
                        <DatePicker
                            variant="bordered"
                            radius="md"
                            size="md"
                            showMonthAndYearPickers
                            className="max-w-full"
                            classNames={{
                                base: "h-11",
                                selectorButton: "text-gray-400",
                                inputWrapper: "bg-white border-gray-200 hover:border-blue-400 focus-within:!border-blue-500 transition-all shadow-sm h-11",
                            }}
                        />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                        <label className="text-sm font-medium text-gray-600 ml-1">Đến ngày</label>
                        <DatePicker
                            variant="bordered"
                            radius="md"
                            size="md"
                            showMonthAndYearPickers
                            className="max-w-full"
                            classNames={{
                                base: "h-11",
                                selectorButton: "text-gray-400",
                                inputWrapper: "bg-white border-gray-200 hover:border-blue-400 focus-within:!border-blue-500 transition-all shadow-sm h-11",
                            }}
                        />
                    </div>

                    <div className="md:col-span-6 space-y-1">
                        <label className="text-sm font-medium text-gray-600 ml-1">Mã vật tư</label>
                        <Input
                            placeholder="Nhập mã vật tư"
                            variant="bordered"
                            radius="md"
                            size="md"
                            classNames={{
                                inputWrapper: "bg-white border-gray-200 hover:border-blue-400 focus-within:!border-blue-500 transition-all shadow-sm h-11",
                                input: "text-sm",
                            }}
                        />
                    </div>

                    <div className="md:col-span-6 space-y-1">
                        <label className="text-sm font-medium text-gray-600 ml-1">Tên đường</label>
                        <Input
                            placeholder="Nhập tên đường"
                            variant="bordered"
                            radius="md"
                            size="md"
                            classNames={{
                                inputWrapper: "bg-white border-gray-200 hover:border-blue-400 focus-within:!border-blue-500 transition-all shadow-sm h-11",
                                input: "text-sm",
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <Button
                        color="primary"
                        startContent={<FunnelIcon className="w-4 h-4" />}
                        className="px-8 h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 rounded-lg"
                    >
                        Lọc
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

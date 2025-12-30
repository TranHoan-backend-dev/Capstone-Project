"use client";

import React from "react";
import { Card, CardBody, Image } from "@heroui/react";

export const MeterPreviewCard = () => {
    return (
        <Card shadow="sm" className="border-none rounded-xl bg-white dark:bg-zinc-900 sticky top-6">
            <CardBody className="p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Xem trước ảnh đồng hồ</h2>

                <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 dark:bg-zinc-800 aspect-square flex items-center justify-center">
                    <Image
                        src="/images/water-meter.png"
                        alt="Water Meter"
                        className="w-full h-full object-cover"
                    />

                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-zinc-400 font-medium">Khách hàng:</span>
                        <span className="text-gray-900 dark:text-white font-bold">Nguyễn Văn A</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-zinc-400 font-medium">Mã KH:</span>
                        <span className="text-gray-900 dark:text-white font-bold">KH001</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-zinc-400 font-medium">Chỉ số cũ:</span>
                        <span className="text-gray-900 dark:text-white font-bold">1,245</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-zinc-400 font-medium">Chỉ số mới:</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">1,267</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-gray-100 dark:border-zinc-800 pt-3">
                        <span className="text-gray-500 dark:text-zinc-400 font-medium">Tiêu thụ:</span>
                        <span className="text-green-600 dark:text-success font-bold text-lg">22 m³</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

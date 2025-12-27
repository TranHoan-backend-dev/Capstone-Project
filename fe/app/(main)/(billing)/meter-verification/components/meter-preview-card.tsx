"use client";

import React from "react";
import { Card, CardBody, Image } from "@heroui/react";

export const MeterPreviewCard = () => {
    return (
        <Card shadow="sm" className="border-none rounded-xl bg-white sticky top-6">
            <CardBody className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Xem trước ảnh đồng hồ</h2>

                <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 aspect-square flex items-center justify-center">
                    <Image
                        src="/images/water-meter.png"
                        alt="Water Meter"
                        className="w-full h-full object-cover"
                    />

                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Khách hàng:</span>
                        <span className="text-gray-900 font-bold">Nguyễn Văn A</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Mã KH:</span>
                        <span className="text-gray-900 font-bold">KH001</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Chỉ số cũ:</span>
                        <span className="text-gray-900 font-bold">1,245</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Chỉ số mới:</span>
                        <span className="text-blue-600 font-bold">1,267</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                        <span className="text-gray-500 font-medium">Tiêu thụ:</span>
                        <span className="text-green-600 font-bold text-lg">22 m³</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

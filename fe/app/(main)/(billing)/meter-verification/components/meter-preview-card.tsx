"use client";

import React from "react";
import { Card, CardBody, Image } from "@heroui/react";

export const MeterPreviewCard = () => {
    return (
        <Card shadow="sm" className="border-none rounded-xl bg-white dark:bg-zinc-900 sticky top-6">
            <CardBody className="p-4">
                <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4">Xem trước ảnh đồng hồ</h2>

                <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 dark:bg-zinc-800 aspect-square flex items-center justify-center">
                    <Image
                        src="/images/water-meter.png"
                        alt="Water Meter"
                        className="w-full h-full object-cover"
                    />

                </div>

                <div className="space-y-3">
                    {previewData.map((item, index) => (
                        <InfoRow
                            key={index}
                            label={item.label}
                            value={item.value}
                            isLast={index === previewData.length - 1}
                            valueClassName={item.valueClassName}
                        />
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

const InfoRow = ({
    label,
    value,
    isLast,
    valueClassName
}: {
    label: string;
    value: string;
    isLast?: boolean;
    valueClassName?: string
}) => (
    <div className={`flex justify-between items-center text-sm ${isLast ? "border-t border-gray-100 dark:border-zinc-800 pt-3" : ""}`}>
        <span className="text-gray-500 dark:text-zinc-400 font-medium">{label}:</span>
        <span className={`font-bold ${valueClassName || "text-gray-900 dark:text-white"}`}>
            {value}
        </span>
    </div>
);

const previewData = [
    { label: "Khách hàng", value: "Nguyễn Văn A" },
    { label: "Mã KH", value: "KH001" },
    { label: "Chỉ số cũ", value: "1,245" },
    { label: "Chỉ số mới", value: "1,267", valueClassName: "text-blue-600 dark:text-blue-400" },
    { label: "Tiêu thụ", value: "22 m³", valueClassName: "text-green-600 dark:text-success text-lg" },
];

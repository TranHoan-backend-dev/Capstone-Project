'use client'

import { GenericDataTable } from '@/components/ui/GenericDataTable'
import { Chip } from '@heroui/react';
import React from 'react'
import { DarkGreenChip } from '@/config/chip.cl';

const PaymentHistory = () => {
    const paymentHistoryData = [
        { id: 1, date: "15/11/2024", amount: "545,200 VND", status: "Đã thanh toán" },
        { id: 2, date: "15/10/2024", amount: "523,800 VND", status: "Đã thanh toán" },
        { id: 3, date: "15/09/2024", amount: "498,750 VND", status: "Đã thanh toán" },
    ];

    const columns = [
        { key: "date", label: "Ngày thanh toán", align: "center" as const },
        { key: "amount", label: "Số tiền", align: "center" as const },
        { key: "status", label: "Trạng thái", align: "center" as const },
    ];

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "amount":
                return <span className="font-bold text-gray-800 dark:text-white">{item.amount}</span>;
            case "status":
                return (
                    <Chip size="sm" variant="flat" color="success" className={`font-medium border-none ${DarkGreenChip}`}>
                        {item.status}
                    </Chip>
                );
            default:
                return <span className="text-gray-600 dark:text-white">{item[columnKey]}</span>;
        }
    };

    return (
        <div className="pb-8">
            <GenericDataTable
                title="Lịch Sử Thanh Toán"
                columns={columns}
                data={paymentHistoryData}
                renderCell={renderCell}
                headerSummary={`${paymentHistoryData.length}`}
                isCollapsible
                paginationProps={{
                    total: 1,
                    initialPage: 1,
                    summary: `${paymentHistoryData.length}`
                }}
            />
        </div>
    )
}

export default PaymentHistory
"use client"

import { FilterSection } from '@/components/ui/FilterSection'
import React, { useState } from 'react'
import { ResultsTable } from './components/results-table'
import { DateValue } from '@heroui/react';

const EstimatePreparationPage = () => {
    const mockData: any[] = [
        {
            id: 1,
            code: "0102580016",
            customerName: "Nguyễn Văn Vũ",
            phone: "0913090736",
            address: "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
            registerDate: "06/08/2025",
            status: "pending_estimate",
        },
        {
            id: 2,
            code: "0102580015",
            customerName: "Nguyễn Văn Vũ",
            phone: "0913090736",
            address: "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
            registerDate: "06/08/2025",
            status: "pending_estimate",
        },
        {
            id: 3,
            code: "0102580014",
            customerName: "Nguyễn Văn Vũ",
            phone: "0913090736",
            address: "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
            registerDate: "06/08/2025",
            status: "pending_estimate",
        },
        {
            id: 4,
            code: "0102580012",
            customerName: "Nguyễn Phúc Ánh",
            phone: "0942681788",
            address: "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
            registerDate: "06/08/2025",
            status: "rejected",
        }
    ];
    const [keyword, setKeyword] = useState("");
    const [from, setFrom] = useState<DateValue | null | undefined>(null);
    const [to, setTo] = useState<DateValue | null | undefined>(null);

    return (
        <>
            <FilterSection
                title="Bộ lọc"
                keyword={keyword}
                from={from}
                to={to}
                setKeyword={setKeyword}
                setFrom={setFrom}
                setTo={setTo}
            />
            <ResultsTable data={mockData} />
        </>
    )
}

export default EstimatePreparationPage
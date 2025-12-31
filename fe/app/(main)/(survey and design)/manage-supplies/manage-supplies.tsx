"use client"

import { FilterSection } from '@/components/ui/FilterSection'
import React, { useState } from 'react'
import { TemplateTable } from './components/template-table'
import { DateValue } from '@heroui/react';

const ManageSuppliesPage = () => {
    const [keyword, setKeyword] = useState("");
    const [from, setFrom] = useState<DateValue | null | undefined>(null);
    const [to, setTo] = useState<DateValue | null | undefined>(null);
    const mockData = [
        { id: 1, code: "02", name: "Lắp đặt hộ dân D15 TP Nam Định", createdAt: "15/05/2020" },
        { id: 2, code: "D15", name: "Lắp đặt công trình công cộng D15", createdAt: "12/05/2020" },
        { id: 3, code: "03", name: "Mẫu vật tư tiêu chuẩn A1", createdAt: "10/05/2020" },
        { id: 4, code: "A5", name: "Lắp đặt điện nước khu vực A5", createdAt: "08/05/2020" },
        { id: 5, code: "B12", name: "Mẫu bốc vật tư khu B12 Hà Nội", createdAt: "05/05/2020" },
    ];

    return (
        <>
            <FilterSection keyword={keyword} from={from} to={to} setKeyword={setKeyword} setFrom={setFrom} setTo={setTo} />
            <TemplateTable data={mockData} />
        </>
    )
}

export default ManageSuppliesPage
"use client"

import React from 'react'
import { FilterSection } from './components/filter-section';
import { ResultsTable } from './components/results-table';

const SettlementLookupPage = () => {
    const mockData: any[] = [
        {
            id: "1",
            code: "01025120007",
            customerName: "Trần Thị Nguyệt",
            phone: "0355909536",
            address: "Thửa 133, Nghiệp 92/2, Khu CN Hòa Xá, Nam Định",
            registerDate: "01/12/2025",
            status: "approved_budget",
        },
        {
            id: "2",
            code: "01025120008",
            customerName: "Trần Thị Nguyệt",
            phone: "0355909536",
            address: "Thửa 132, Nghiệp 92/2, Khu CN Hòa Xá, Nam Định",
            registerDate: "01/12/2025",
            status: "approved_budget",
        },
        {
            id: "3",
            code: "01025120009",
            customerName: "Trần Xuân Hiếu",
            phone: "0913575994",
            address: "Xã Nghĩa Phú, Huyện Nam Trực, Nam Định",
            registerDate: "01/12/2025",
            status: "approved_budget",
        },
        {
            id: "4",
            code: "01025120110",
            customerName: "Mai Thị Khánh",
            phone: "0987654321",
            address: "64/5, Vĩnh Khê, Phường Nam Định, TP. Nam Định",
            registerDate: "27/11/2025",
            status: "approved_budget",
        },
        {
            id: "5",
            code: "01025120124",
            customerName: "Hoàng Thế Quý",
            phone: "0915705720",
            address: "29B, Trần Huy Liệu, P. Thành Nam, TP. Nam Định",
            registerDate: "26/11/2025",
            status: "rejected_budget",
        },
    ];

    return (
        <>
            <FilterSection />
            <ResultsTable data={mockData} />
        </>
    )
}

export default SettlementLookupPage
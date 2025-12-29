"use client"

import React from 'react'
import { FilterSection } from './filter-section'
import { ResultsTable } from './results-table'

const Customers = () => {
    const branches = [{ label: "Tất cả", value: "all" }];
    const areas = [{ label: "Tất cả", value: "all" }];
    const districts = [{ label: "Tất cả", value: "all" }];
    const wards = [{ label: "Tất cả", value: "all" }];

    const mockData = [
        {
            id: 1,
            customerCode: "001523",
            oldCustomerCode: "NT12450",
            number: "01D226 – 157",
            customerName: "Đặng Thị Như",
            address: "30 Văn Cao, Nam Định",
            status: "Bình thường",
        },
        {
            id: 2,
            customerCode: "001523",
            oldCustomerCode: "NT12450",
            number: "01D226 – 157",
            customerName: "Đặng Thị Như",
            address: "30 Văn Cao, Nam Định",
            status: "Bình thường",
        },
    ];

    return (
        <>
            <FilterSection
                branches={branches}
                areas={areas}
                districts={districts}
                wards={wards}
            />

            <ResultsTable data={mockData} />
        </>
    )
}

export default Customers
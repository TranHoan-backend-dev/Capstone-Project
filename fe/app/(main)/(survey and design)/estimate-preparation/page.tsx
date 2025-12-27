import React from "react";
import { FilterSection } from "./components/filter-section";
import { ResultsTable } from "./components/results-table";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Lập dự toán',
    description: 'Trang lập dự toán thiết kế',
}

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

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Lập dự toán", href: "/estimate-preparation" },
            ]} />

            <div className="space-y-6 pt-2">
                <FilterSection />
                <ResultsTable data={mockData} />
            </div>
        </>
    );
};

export default EstimatePreparationPage;

"use client";

import React from "react";
import { FilterSection } from "./components/filter-section";
import { ResultsTable } from "./components/results-table";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";

const EstimateLookupPage = () => {
    const mockData: any[] = [
        {
            id: 1,
            code: "01025120041",
            name: "Đoàn Văn Lịch",
            phone: "0849288666",
            address: "Lô 4 thửa 5- Tập thể công an, Vân Cao, Nam Định",
            date: "05/12/2025",
            status: "approved",
        },
        {
            id: 2,
            code: "01025120040",
            name: "Trịnh Văn Toàn",
            phone: "0849288666",
            address: "Lô 4 thửa 6- Tập thể Công An, Vân Cao, Nam Định",
            date: "05/12/2025",
            status: "pending_approval",
        },
        {
            id: 3,
            code: "01025120031",
            name: "Trần Thị Vinh",
            phone: "0912975795",
            address: "Thửa 3 ngõ 91, Cầu Đông, Nam Định",
            date: "04/12/2025",
            status: "approved",
        },
        {
            id: 4,
            code: "01025120033",
            name: "Nguyễn Anh Tuấn",
            phone: "0943539157",
            address: "Ngõ 75, Cầu Đông, Nam Định",
            date: "05/12/2025",
            status: "pending_approval",
        },
        {
            id: 5,
            code: "01025120035",
            name: "Nguyễn Việt Liên",
            phone: "0932256539",
            address: "Lô 37 thửa 37, KĐT Mỹ Trung, Nam Định",
            date: "05/12/2025",
            status: "approved",
        },
        {
            id: 6,
            code: "01025120020",
            name: "Nguyễn Văn Hà",
            phone: "0945946685",
            address: "Thửa 293, Phường Trường Thi, Nam Định",
            date: "04/12/2025",
            status: "pending_approval",
        },
        {
            id: 7,
            code: "01025120018",
            name: "Đoàn Thị Hạnh",
            phone: "0826941992",
            address: "Thửa 433 Ngõ 314, Vĩnh Mạc, Nam Định",
            date: "04/12/2025",
            status: "pending_approval",
        },
        {
            id: 8,
            code: "01025120019",
            name: "Trần Thị Hồng Nhung",
            phone: "0826941992",
            address: "Thửa 432 Ngõ 314, Vĩnh Mạc, Nam Định",
            date: "05/12/2025",
            status: "pending_estimate",
        },
        {
            id: 9,
            code: "01025120017",
            name: "Lê Văn Nhẫn",
            phone: "0989733329",
            address: "Lô 39 thửa 129, KĐT Mỹ Trung, Nam Định",
            date: "03/12/2025",
            status: "redo",
        },
        {
            id: 10,
            code: "01025120012",
            name: "Nguyễn Văn Du",
            phone: "0915389616",
            address: "Ngách 14/129, Lộc Vượng, Nam Định",
            date: "03/12/2025",
            status: "approved",
        },
    ];

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Khảo sát thiết kế", href: "#" },
                { label: "Tra cứu dự toán", href: "/estimate-lookup" },
            ]} />

            <div className="space-y-6 pt-2">
                <FilterSection />
                <ResultsTable data={mockData} />
            </div>
        </>
    );
};

export default EstimateLookupPage;

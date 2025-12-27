import React from "react";
import { FilterSection } from "./components/filter-section";
import { TemplateTable } from "./components/template-table";
import { Metadata } from "next";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";

export const metadata: Metadata = {
    title: "Quản lý mẫu bốc vật tư",
    description: "Trang quản lý và tra cứu các mẫu bốc vật tư vật liệu trong hệ thống CRM.",
};

export default function MaterialTemplatePage() {
    const mockData = [
        { id: 1, code: "02", name: "Lắp đặt hộ dân D15 TP Nam Định", createdAt: "15/05/2020" },
        { id: 2, code: "D15", name: "Lắp đặt công trình công cộng D15", createdAt: "12/05/2020" },
        { id: 3, code: "03", name: "Mẫu vật tư tiêu chuẩn A1", createdAt: "10/05/2020" },
        { id: 4, code: "A5", name: "Lắp đặt điện nước khu vực A5", createdAt: "08/05/2020" },
        { id: 5, code: "B12", name: "Mẫu bốc vật tư khu B12 Hà Nội", createdAt: "05/05/2020" },
    ];

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Quản lý mẫu bốc vật tư", href: "/material-template" },
            ]} />

            <div className="space-y-6 pt-2">
                <FilterSection />
                <TemplateTable data={mockData} />
            </div>
        </>
    );
}

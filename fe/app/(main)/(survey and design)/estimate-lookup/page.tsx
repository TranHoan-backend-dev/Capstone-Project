import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import EstimateLookup from "./components/estimate-lookup";

export const metadata: Metadata = {
    title: 'Tra cứu dự toán',
    description: 'Tra cứu dự toán',
}

const EstimateLookupPage = () => {
    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Khảo sát thiết kế", href: "#" },
                { label: "Tra cứu dự toán", href: "/estimate-lookup" },
            ]} />

            <div className="space-y-6 pt-2">
                <EstimateLookup />
            </div>
        </>
    );
};

export default EstimateLookupPage;

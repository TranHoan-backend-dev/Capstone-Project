import React from "react";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { Metadata } from "next";
import EstimateLookupPage from "./estimate-lookup";

export const metadata: Metadata = {
    title: 'Tra cứu dự toán',
    description: 'Tra cứu dự toán',
}

const EstimateLookup = () => {
    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Khảo sát thiết kế", href: "#" },
                { label: "Tra cứu dự toán", href: "/estimate-lookup" },
            ]} />

            <div className="space-y-6 pt-2">
                <EstimateLookupPage />
            </div>
        </>
    );
};

export default EstimateLookup;

import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import EstimatePreparation from "./components/estimate-preparation-page";

export const metadata: Metadata = {
    title: 'Lập dự toán',
    description: 'Trang lập dự toán thiết kế',
}

const EstimatePreparationPage = () => {

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Lập dự toán", href: "/estimate-preparation" },
            ]} />

            <div className="space-y-6 pt-2">
                <EstimatePreparation />
            </div>
        </>
    );
};

export default EstimatePreparationPage;

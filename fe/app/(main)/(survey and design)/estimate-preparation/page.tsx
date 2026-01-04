import React from "react";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { Metadata } from "next";
import EstimatePreparationPage from "./estimate-preparation-page";

export const metadata: Metadata = {
    title: 'Lập dự toán',
    description: 'Trang lập dự toán thiết kế',
}

const EstimatePreparation = () => {

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Lập dự toán", href: "/estimate-preparation" },
            ]} />

            <div className="space-y-6 pt-2">
                <EstimatePreparationPage />
            </div>
        </>
    );
};

export default EstimatePreparation;

import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import RunEstimation from "./components/run-estimation";

export const metadata: Metadata = {
    title: "Chạy Dự Toán",
    description: "Màn hình lập dự toán kỹ thuật và chi phí vật tư",
};

const RunEstimationPage = () => {
    const breadcrumbItems = [
        { label: "Trang chủ", href: "/home" },
        { label: "Lập dự toán", href: "#" },
        { label: "Chạy dự toán" }
    ];

    return (
        <>
            <CustomBreadcrumb items={breadcrumbItems} />

            <div className="pt-2 space-y-6"><RunEstimation /></div>
        </>
    );
};

export default RunEstimationPage;

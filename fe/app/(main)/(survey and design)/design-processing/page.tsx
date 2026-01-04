import React from "react";
import { Metadata } from "next";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import DesignProcessingPage from "./design-processing-page";

export const metadata: Metadata = {
    title: "Xử lý đơn chờ thiết kế & Thiết kế",
    description: "Xử lý đơn chờ thiết kế & Thiết kế",
}

const DesignProcessing = () => {
    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Khảo sát thiết kế", href: "#" },
                { label: "Xử lý đơn chờ thiết kế & Thiết kế", href: "/design-processing" },
            ]} />

            <div className="space-y-6 pt-2">
                <DesignProcessingPage />
            </div>
        </>
    );
};

export default DesignProcessing;
import React from "react";
import { Metadata } from "next";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import DesignProcessing from "./components/design-processing-page";

export const metadata: Metadata = {
    title: "Xử lý đơn chờ thiết kế & Thiết kế",
    description: "Xử lý đơn chờ thiết kế & Thiết kế",
}

const DesignProcessingPage = () => {
    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Khảo sát thiết kế", href: "#" },
                { label: "Xử lý đơn chờ thiết kế & Thiết kế", href: "/design-processing" },
            ]} />

            <div className="space-y-6 pt-2">
                <DesignProcessing />
            </div>
        </>
    );
};

export default DesignProcessingPage;

import React from "react";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { Metadata } from "next";
import NewInstallationLookupContent from "./new-installation-lookup";

export const metadata: Metadata = {
    title: "Tra cứu đơn lắp đặt mới",
    description: "Tra cứu đơn lắp đặt mới",
}

const NewInstallationLookupPage = () => {
    const breadcrumbItems = [
        { label: "Trang chủ", href: "/home" },
        { label: "Tra cứu đơn lắp đặt mới" }
    ];

    return (
        <>
            <CustomBreadcrumb items={breadcrumbItems} />

            <div className="pt-2 space-y-6">
                <NewInstallationLookupContent />
            </div>
        </>
    );
};

export default NewInstallationLookupPage;
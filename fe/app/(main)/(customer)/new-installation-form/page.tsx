import React from "react";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { Metadata } from "next";
import NewInstallationFormContent from "./new-installation-form";

export const metadata: Metadata = {
    title: "Đơn lắp đặt mới",
    description: "Đơn lắp đặt mới",
}

const NewInstallationFormPage = () => {
    const breadcrumbItems = [
        { label: "Trang chủ", href: "/home" },
        { label: "Đơn lắp đặt mới" }
    ];

    return (
        <>
            <CustomBreadcrumb items={breadcrumbItems} />

            <div className="pt-2 space-y-6">
                <NewInstallationFormContent />
            </div>
        </>
    );
};

export default NewInstallationFormPage;
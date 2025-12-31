import React from "react";
import { Metadata } from "next";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import ManageSuppliesPage from "./manage-supplies";

export const metadata: Metadata = {
    title: "Quản lý mẫu bốc vật tư",
    description: "Trang quản lý và tra cứu các mẫu bốc vật tư vật liệu trong hệ thống CRM.",
};

export const ManageSupplies = () => {
    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Quản lý mẫu bốc vật tư", href: "/material-template" },
            ]} />

            <div className="space-y-6 pt-2">
                <ManageSuppliesPage />
            </div>
        </>
    );
}

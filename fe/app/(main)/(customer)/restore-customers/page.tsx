import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import RestoreCustomers from "./components/restore-customers";

export const metadata: Metadata = {
    title: 'Khôi phục khách hàng hủy',
    description: 'Khôi phục khách hàng hủy',
}

const RestoreCustomerPage = () => {
    return (
        <>
            <CustomBreadcrumb
                items={[
                    { label: "Trang chủ", href: "/home" },
                    { label: "Khôi phục khách hàng hủy", isCurrent: true },
                ]}
            />

            <div className="space-y-6 pt-2">
                <RestoreCustomers />
            </div>
        </>
    );
};

export default RestoreCustomerPage;

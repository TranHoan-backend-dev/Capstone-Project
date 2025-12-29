import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import SettlementLookup from "./components/settlement-lookup";

export const metadata: Metadata = {
    title: "Tra cứu quyết toán",
    description: "Tra cứu quyết toán",
}

const SettlementLookupPage = () => {
    return (
        <>
            <CustomBreadcrumb
                items={[
                    { label: "Trang chủ", href: "/home" },
                    { label: "Tra cứu quyết toán", href: "/settlement-lookup" },
                ]}
            />

            <div className="space-y-6 pt-2">
                <SettlementLookup />
            </div>
        </>
    );
};

export default SettlementLookupPage;

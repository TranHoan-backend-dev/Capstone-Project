import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import CustomerInformation from "./components/customer-information";
import WaterIndexMetrics from "./components/water-index-metrics";
import PaymentDetails from "./components/payment-details";
import Actions from "./components/actions";
import PaymentHistory from "./components/payment-history";

export const metadata: Metadata = {
    title: "Hồ sơ cá nhân",
    description: "Thông tin chi tiết và lịch sử thanh toán của khách hàng",
};

const ProfilePage = () => {

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Thông tin khách hàng", isCurrent: true },
            ]} />

            <div className="space-y-6 pt-2">
                <CustomerInformation />
                <WaterIndexMetrics />
                <PaymentDetails />
                <PaymentHistory />
                <Actions />
            </div>
        </>
    );
};

export default ProfilePage;

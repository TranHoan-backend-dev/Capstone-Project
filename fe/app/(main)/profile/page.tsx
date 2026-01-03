import React from "react";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import ProfilePage from "./profile-page";

export const metadata: Metadata = {
    title: "Hồ sơ cá nhân",
    description: "Thông tin chi tiết và lịch sử thanh toán của khách hàng",
};

const Profile = () => {

    return (
        <>
            <CustomBreadcrumb items={[
                { label: "Trang chủ", href: "/home" },
                { label: "Thông tin khách hàng", isCurrent: true },
            ]} />

            <div className="space-y-6 pt-2">
                <ProfilePage />
            </div>
        </>
    );
};

export default Profile;

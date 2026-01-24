import React from "react";
import { Metadata } from "next";

import ProfilePage from "./profile-page";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Hồ sơ nhân viên",
  description:
    "Thông tin chi tiết của nhân viên Công ty Cổ Phần Nước Nam Định - NAWACO",
};

const Profile = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Thông tin khách hàng", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <ProfilePage />
      </div>
    </>
  );
};

export default Profile;

"use client";

import React from "react";

import EmployeeProfile from "./components/employee-information";
import { Spinner } from "@heroui/react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";


const ProfilePage = () => {
   const { profile, loading } = useEmployeeProfile();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-default-500">
        <Spinner size="sm" />
        <span>Đang tải thông tin...</span>
      </div>
    );
  }

  if (!profile) {
    return <p>Không thể tải hồ sơ người dùng</p>;
  }

  return (
    <>
      <EmployeeProfile data={profile} />
    </>
  );
};

export default ProfilePage;

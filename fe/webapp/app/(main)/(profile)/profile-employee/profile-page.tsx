"use client";

import React from "react";

import EmployeeProfile from "./components/employee-information";
import { Spinner } from "@heroui/react";
import { useProfile } from "@/hooks/useLogin";


const ProfilePage = () => {
   const { profile } = useProfile();

  if (!profile) {
    return <p>Không thể tải thông tin người dùng</p>;
  }

  return (
    <>
      <EmployeeProfile data={profile} />
    </>
  );
};

export default ProfilePage;

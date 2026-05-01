"use client";

import React, { useState } from "react";
import { AccessRightsTable } from "./components/access-rights-table";
import { FilterSection } from "./components/filter-section";
import { useProfile } from "@/hooks/useLogin";

const AccessRightsPage = () => {
  const [username, setUsername] = useState("");
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");

  const canView = isITStaff;
  if (!canView) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <FilterSection username={username} onSearch={setUsername} />
      <AccessRightsTable username={username} />
    </>
  );
};

export default AccessRightsPage;

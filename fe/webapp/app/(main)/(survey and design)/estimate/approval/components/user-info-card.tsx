"use client";

import { ROLE_META } from "@/config/role.config";
import { Role } from "@/constants/roles";
import React from "react";

interface UserInfoCardProps {
  fullname: string;
  role: string;
  significanceUrl?: string;
}

const getRoleVietnamese = (role: string): string => {
  const roleMeta = ROLE_META[role as Role];
  return roleMeta?.label || role || "Không xác định";
};

const UserInfoCard = ({
  fullname,
  role,
  significanceUrl,
}: UserInfoCardProps) => {
  const roleLabel = getRoleVietnamese(role);
  const department = ROLE_META[role as Role]?.department;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary text-xl font-semibold">
            {fullname?.charAt(0) || "?"}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {fullname || "Đang tải..."}
          </p>
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vai trò: {roleLabel}
            </p>
            {department && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Phòng ban: {department}
              </p>
            )}
          </div>
        </div>
      </div>

      {significanceUrl ? (
        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            Đã có chữ ký điện tử sẵn sàng
          </p>
        </div>
      ) : (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Chưa có chữ ký điện tử. Vui lòng cập nhật thông tin cá nhân.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInfoCard;

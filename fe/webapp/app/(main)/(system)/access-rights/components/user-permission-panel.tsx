"use client";

import React, { useState, useEffect } from "react";
import { Checkbox, Spinner } from "@heroui/react";

interface UserPermissionPanelProps {
  empId: string;
  username: string;
}

export const UserPermissionPanel = ({
  empId,
  username,
}: UserPermissionPanelProps) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const isAllSelected = selectedPermissions.length === permissions.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions);
    }
  };

  const handleTogglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/auth/employees/${empId}/pages`);

        if (!res.ok) {
          console.error("Fetch permission failed");
          return;
        }

        const result = await res.json();

        setPermissions(result.data);
        setSelectedPermissions(result.data);
      } catch (error) {
        setPermissions([]);
        setSelectedPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [empId]);

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-base font-semibold">
          Người dùng: <span className="text-blue-600">{username}</span>
        </h3>

        <Checkbox isSelected={isAllSelected} onChange={handleToggleAll}>
          {isAllSelected ? "Bỏ chọn hết" : "Chọn hết"}
        </Checkbox>
      </div>

      {/* Permission list */}
      <div className="rounded-xl border bg-default-50 p-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner label="Loading..." />
          </div>
        ) : permissions.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            Không có dữ liệu để hiển thị
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissions.map((permission) => (
              <Checkbox
                key={permission}
                isSelected={selectedPermissions.includes(permission)}
                onChange={() => handleTogglePermission(permission)}
              >
                {permission}
              </Checkbox>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

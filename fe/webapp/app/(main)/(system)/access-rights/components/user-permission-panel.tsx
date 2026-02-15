"use client";

import React, { useState, useEffect } from "react";
import { Card, Checkbox, Spinner, TableBody } from "@heroui/react";

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
    <Card
      className="overflow-hidden bg-content1 transition-all duration-300"
      shadow="sm"
    >
      <div className="rounded-xl bg-white p-6 shadow-sm border-none rounded-xl bg-content1 overflow-hidden transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Người dùng: <span className="text-blue-600">{username}</span>
          </h3>

          <Checkbox isSelected={isAllSelected} onChange={handleToggleAll}>
            {isAllSelected ? "Bỏ chọn hết" : "Chọn hết"}
          </Checkbox>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center">
              <Spinner label="Loading..." />
            </div>
          ) : permissions.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Không có dữ liệu để hiển thị
            </div>
          ) : (
            permissions.map((permission) => (
              <Checkbox
                key={permission}
                isSelected={selectedPermissions.includes(permission)}
                onChange={() => handleTogglePermission(permission)}
              >
                {permission}
              </Checkbox>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

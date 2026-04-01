"use client";

import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Tooltip,
} from "@heroui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import CustomButton from "@/components/ui/custom/CustomButton";

interface UserPermissionPanelProps {
  empId: string;
  username: string;
  userInfo?: {
    fullName?: string;
    email?: string;
    departmentName?: string;
    networkName?: string;
    jobs?: string;
  };
}

export const UserPermissionPanel = ({
  empId,
  username,
  userInfo,
}: UserPermissionPanelProps) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isAllSelected = selectedPermissions.length === permissions.length;
  const isIndeterminate =
    selectedPermissions.length > 0 &&
    selectedPermissions.length < permissions.length;

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
        console.error("Error fetching permissions:", error);
        setPermissions([]);
        setSelectedPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [empId]);

  const parsedJobs = React.useMemo(() => {
    if (!userInfo?.jobs) return [];
    try {
      if (typeof userInfo.jobs === "string") {
        const parsed = JSON.parse(userInfo.jobs);
        return Array.isArray(parsed) ? parsed : [userInfo.jobs];
      }
      return Array.isArray(userInfo.jobs) ? userInfo.jobs : [userInfo.jobs];
    } catch {
      return [userInfo.jobs];
    }
  }, [userInfo?.jobs]);

  const filteredPermissions = permissions.filter((permission) =>
    permission.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getUserInitial = () => {
    if (userInfo?.fullName) {
      return userInfo.fullName.charAt(0).toUpperCase();
    }
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 w-full">
        <CardBody className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {userInfo?.fullName || "Chưa có tên"}
              </h3>

              <Divider className="my-3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {userInfo?.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-default-600">{userInfo.email}</span>
                  </div>
                )}
                {userInfo?.departmentName && (
                  <div className="flex items-center gap-2">
                    <span className="text-default-600">
                      {userInfo.departmentName}
                    </span>
                  </div>
                )}
                {userInfo?.networkName && (
                  <div className="flex items-center gap-2">
                    <span className="text-default-600">
                      {userInfo.networkName}
                    </span>
                  </div>
                )}
              </div>

              {/* {parsedJobs.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-default-600">
                      Quyền hạn công việc
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedJobs.map((job, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        color="primary"
                        classNames={{
                          content: "text-xs",
                        }}
                      >
                        {job}
                      </Chip>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">Phân quyền truy cập</h3>
          </div>

          <div className="flex items-center gap-3">
            <CustomButton
              size="sm"
              variant="flat"
              color={isAllSelected ? "danger" : "primary"}
              onPress={handleToggleAll}
              startContent={
                isAllSelected ? (
                  <CheckApprovalIcon className="w-4 h-4" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )
              }
            >
              {isAllSelected ? "Bỏ chọn hết" : "Chọn hết"}
            </CustomButton>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" label="Đang tải danh sách quyền..." />
            </div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-default-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3"></div>
              <p className="text-default-500">Không có dữ liệu để hiển thị</p>
              <p className="text-sm text-default-400 mt-1">
                Không tìm thấy quyền truy cập nào
              </p>
            </div>
          ) : (
            <>
              {searchTerm && filteredPermissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-default-500">
                    Không tìm thấy quyền "{searchTerm}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredPermissions.map((permission) => (
                    <Tooltip
                      key={permission}
                      content={permission}
                      placement="top"
                      closeDelay={0}
                    >
                      <div className="flex items-center p-2 rounded-lg hover:bg-default-100 transition-colors">
                        <Checkbox
                          isSelected={selectedPermissions.includes(permission)}
                          onChange={() => handleTogglePermission(permission)}
                          size="sm"
                          classNames={{
                            label:
                              "text-sm cursor-pointer text-default-700 truncate",
                          }}
                        >
                          <span className="truncate">{permission}</span>
                        </Checkbox>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              )}
            </>
          )}
        </CardBody>

        {!loading && permissions.length > 0 && (
          <>
            <Divider />
            <div className="px-5 py-3 bg-default-50/50 flex items-center justify-between">
              <div className="text-sm text-default-600">
                <span className="font-medium">
                  {selectedPermissions.length}
                </span>{" "}
                quyền được chọn
              </div>
              {isIndeterminate && (
                <Chip size="sm" variant="flat" color="warning">
                  Đã chọn một phần
                </Chip>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

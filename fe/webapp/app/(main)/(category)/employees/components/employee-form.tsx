"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { EmployeeFormProps, Role, ROLE_META } from "@/types";
import { authFetch } from "@/utils/authFetch";
import { RoleSelect } from "./role-select";

export const EmployeeForm = ({
  initialData,
  onSuccess,
  onClose,
}: EmployeeFormProps) => {
  const isEdit = !!initialData?.id;

  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber || "",
  );
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState<Role | undefined>(initialData?.role);
  const [departmentId, setDepartmentId] = useState(
    initialData?.departmentId || "",
  );
  const [networkId, setNetworkId] = useState(initialData?.networkId || "");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setFullName(initialData?.fullName || "");
    setPhoneNumber(initialData?.phoneNumber || "");
    setEmail(initialData?.email || "");
    setRole(initialData?.role);
    setDepartmentId(initialData?.departmentId || "");
    setNetworkId(initialData?.networkId || "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;
    try {
      setSubmitLoading(true);

      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        CallToast({
          title: "Lỗi",
          message: "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số",
          color: "danger",
        });
        return;
      }

      if (!fullName.trim()) {
        CallToast({
          title: "Lỗi",
          message: "Tên nhân viên không được để trống",
          color: "danger",
        });
        return;
      }

      if (!isEdit && !email.trim()) {
        CallToast({
          title: "Lỗi",
          message: "Email không được để trống",
          color: "danger",
        });
        return;
      }

      if (!role && !isEdit) {
        CallToast({
          title: "Lỗi",
          message: "Vui lòng chọn vai trò",
          color: "danger",
        });
        return;
      }

      const url = isEdit
        ? `/api/auth/employees/${initialData?.id}`
        : `/api/auth/employees`;

      const method = isEdit ? "PUT" : "POST";

      let payload;
      if (isEdit) {
        // Update payload - KHÔNG bao gồm role vì backend không cho phép update role
        payload = {
          name: fullName,
          phone: phoneNumber,
          departmentId: departmentId || undefined,
          networkId: networkId || undefined,
          isActive: true,
        };
        // Role không được gửi lên khi update
      } else {
        // Create payload
        payload = {
          username: email.split("@")[0],
          email: email,
          fullName: fullName,
          phone: phoneNumber,
          role: role?.toUpperCase(),
          departmentId: departmentId || undefined,
          waterSupplyNetworkId: networkId || undefined,
        };
      }

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }

      CallToast({
        title: "Thành công",
        message: isEdit
          ? "Cập nhật nhân viên thành công!"
          : "Thêm mới nhân viên thành công!",
        color: "success",
      });
      onSuccess();
    } catch (e: any) {
      let message = e.message || "Có lỗi xảy ra";
      if (message.includes("Phone number already exists")) {
        message = "Số điện thoại đã tồn tại";
      } else if (message.includes("Username already exists")) {
        message = "Tên đăng nhập đã tồn tại";
      } else if (message.includes("Email already exists")) {
        message = "Email đã tồn tại";
      }
      CallToast({
        title: "Lỗi",
        message: message,
        color: "danger",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Card shadow="sm" className="rounded-2xl border border-divider bg-content1">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Cập nhật Nhân viên" : "Thêm mới Nhân viên"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <CustomInput
              label="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <CustomInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={isEdit}
              required={!isEdit}
            />
            <RoleSelect
              value={role}
              onChange={setRole}
              isDisabled={isEdit}
              required={!isEdit}
            />
            <CustomInput
              label="Mã phòng ban"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              placeholder="Nhập mã phòng ban (không bắt buộc)"
            />
            <CustomInput
              label="Mã chi nhánh cấp nước"
              value={networkId}
              onChange={(e) => setNetworkId(e.target.value)}
              placeholder="Nhập mã chi nhánh (không bắt buộc)"
            />
          </div>
          <div className="flex justify-end gap-4">
            <CustomButton variant="light" onPress={onClose}>
              Huỷ
            </CustomButton>
            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
              startContent={
                submitLoading ? null : <CheckApprovalIcon className="w-4 h-4" />
              }
              onPress={handleSubmit}
              isDisabled={
                !fullName.trim() ||
                !phoneNumber.trim() ||
                (!isEdit && (!email.trim() || !role)) ||
                submitLoading
              }
              isLoading={submitLoading}
            >
              {submitLoading ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

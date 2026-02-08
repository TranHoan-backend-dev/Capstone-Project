"use client";

import { useState } from "react";
import { Card, CardBody, Chip, Avatar } from "@heroui/react";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomField from "@/components/ui/custom/CustomField";
import { PencilIcon } from "@/config/chip-and-icon";
import { EmployeeProfileData } from "@/types";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { ROLE_META } from "@/config/role.config";
import { Role } from "@/constants/roles";
import { CallToast } from "@/components/ui/CallToast";

interface EmployeeProfileProps {
  data: EmployeeProfileData;
}

const EmployeeProfile = ({ data }: EmployeeProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(data);
  const [formData, setFormData] = useState<EmployeeProfileData>(data);
  const role = formData.role as Role;
  const roleLabel = ROLE_META[role]?.label ?? "Không xác định";
  const genderLabel =
    formData.gender === "true"
      ? "Nam"
      : formData.gender === "false"
        ? "Nữ"
        : "Chưa cập nhật";

  const handleChange = (key: keyof EmployeeProfileData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        fullname: formData.fullname,
        phoneNumber: formData.phoneNumber,
        avatarUrl: formData.avatarUrl,
        gender: formData.gender,
        birthday: formData.birthday,
        address: formData.address,
      };

      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Cập nhật thông tin thất bại");
      }

      setFormData((prev) => ({
        ...prev,
        ...json.data,
      }));
      setOriginalData(json.data);
      setIsEditing(false);
      CallToast({
        title: "Thành công",
        message: "Cập nhật thông tin thành công!",
        color: "success",
      });
    } catch (error: any) {
      CallToast({
        title: "Thất bại",
        message: error.message || "Cập nhật thông tin thất bại!",
        color: "danger",
      });
    }
  };

  return (
    <Card className="border-none rounded-2xl bg-white dark:bg-zinc-900">
      <CardBody className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold">Hồ Sơ Nhân Viên</h2>

            <div className="flex items-center gap-4">
              <Avatar
                src={formData.avatarUrl}
                className="w-20 h-20"
                isBordered
              />
              <div>
                <CustomField
                  label="Họ và tên"
                  value={formData.fullname}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("fullname", v)}
                />
                <p className="text-sm text-gray-500">{roleLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <CustomField
                label="Tên đăng nhập"
                value={formData.username}
                isEditing={false}
              />

              <CustomField
                label="Chức vụ"
                value={roleLabel}
                isEditing={false}
                onChange={(v) => handleChange("role", v)}
              />

              <CustomField
                label="Email"
                value={formData.email}
                isEditing={false}
              />

              <CustomField
                label="Số điện thoại"
                value={formData.phoneNumber}
                isEditing={isEditing}
                onChange={(v) => handleChange("phoneNumber", v)}
              />

              <CustomField
                label="Ngày sinh"
                value={formData.birthday}
                type="date"
                isEditing={isEditing}
                onChange={(v) => handleChange("birthday", v)}
              />

              <CustomField
                label="Địa chỉ"
                value={formData.address}
                isEditing={isEditing}
                onChange={(v) => handleChange("address", v)}
              />

              <div className="space-y-1">
                {isEditing ? (
                  <CustomSelect
                    label="Giới tính"
                    selectedKeys={[String(formData.gender)]}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      setFormData({
                        ...formData,
                        gender: value,
                      });
                    }}
                    options={[
                      { label: "Nam", value: "true" },
                      { label: "Nữ", value: "false" },
                    ]}
                  />
                ) : (
                  <CustomField
                    label="Giới tính"
                    value={genderLabel}
                    isEditing={isEditing}
                    onChange={(v) => handleChange("gender", v)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            {isEditing ? (
              <>
                <CustomButton
                  variant="light"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </CustomButton>
                <CustomButton color="primary" onClick={handleSave}>
                  Lưu
                </CustomButton>
              </>
            ) : (
              <CustomButton
                startContent={<PencilIcon className="w-4 h-4" />}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </CustomButton>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default EmployeeProfile;

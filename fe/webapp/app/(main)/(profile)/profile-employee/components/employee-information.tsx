"use client";

import { useState, useRef } from "react";
import { Card, CardBody, Chip, Avatar } from "@heroui/react";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomField from "@/components/ui/custom/CustomField";
import { PencilIcon } from "@/config/chip-and-icon";
import { EmployeeProfileData } from "@/types";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { ROLE_META } from "@/config/role.config";
import { Role } from "@/constants/roles";
import { CallToast } from "@/components/ui/CallToast";
import { formatDateProfile } from "@/utils/format";
import { validateProfile } from "@/utils/profileValidation";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = (value?: string | null) => {
    return value && value.trim() !== "" ? value : "Không xác định";
  };

  const handleChange = (key: keyof EmployeeProfileData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        fullName: formData.fullname,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender === "true",
        birthdate: formatDateProfile(formData.birthday),
        address: formData.address,
      };

      const error = validateProfile(payload);
      if (error) {
        CallToast({
          title: "Lỗi",
          message: error,
          color: "danger",
        });
        return;
      }
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      CallToast({
        title: "Lỗi",
        message: "Vui lòng chọn file ảnh hợp lệ",
        color: "danger",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      CallToast({
        title: "Lỗi",
        message: "Dung lượng ảnh tối đa 5MB",
        color: "danger",
      });
      return;
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("avatar", file);

      const res = await fetch("/api/auth/avatar", {
        method: "PATCH",
        body: formDataUpload,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Upload avatar thất bại");
      }

      setFormData((prev) => ({
        ...prev,
        avatarUrl: json.data.avatarUrl,
      }));

      setOriginalData((prev) => ({
        ...prev,
        avatarUrl: json.data.avatarUrl,
      }));

      CallToast({
        title: "Thành công",
        message: "Cập nhật ảnh đại diện thành công",
        color: "success",
      });
    } catch (err: any) {
      CallToast({
        title: "Thất bại",
        message: err.message || "Không thể upload avatar",
        color: "danger",
      });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <Card className="border-none rounded-2xl bg-white dark:bg-zinc-900">
      <CardBody className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold">Hồ Sơ Nhân Viên</h2>

            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar
                  src={formData.avatarUrl}
                  className="w-20 h-20 transition-opacity group-hover:opacity-80"
                  isBordered
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <PencilIcon className="w-5 h-5 text-white" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                hidden
                onChange={handleAvatarChange}
              />

              <div>
                <CustomField
                  label="Họ và tên"
                  value={displayValue(formData.fullname)}
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
                value={displayValue(roleLabel)}
                isEditing={false}
                onChange={(v) => handleChange("role", v)}
              />

              <CustomField
                label="Email"
                value={displayValue(formData.email)}
                isEditing={false}
              />

              <CustomField
                label="Số điện thoại"
                value={displayValue(formData.phoneNumber)}
                isEditing={isEditing}
                onChange={(v) => handleChange("phoneNumber", v)}
              />

              <CustomField
                label="Ngày sinh"
                value={displayValue(formData.birthday)}
                type="date"
                isEditing={isEditing}
                onChange={(v) => handleChange("birthday", v)}
              />

              <CustomField
                label="Địa chỉ"
                value={displayValue(formData.address)}
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

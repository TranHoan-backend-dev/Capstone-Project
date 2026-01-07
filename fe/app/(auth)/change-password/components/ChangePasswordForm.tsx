"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import PasswordRequirements from "./PasswordRequirements";
import ChangePasswordHeader from "./ChangePasswordHeader";

import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/custom/CustomButton";
import { passwordSchema } from "@/schemas/password.schema";
import { RejectIcon, DocumentIcon } from "@/config/chip-and-icon";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),

    newPassword: passwordSchema,

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới và xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ChangePasswordFormData, string>>
  >({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const result = changePasswordSchema.safeParse(formData);

    if (!result.success) {
      const errors: Partial<Record<keyof ChangePasswordFormData, string>> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ChangePasswordFormData;
        if (field) {
          errors[field] = err.message;
        }
      });

      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đổi mật khẩu thất bại");
      }

      setSuccess("Đổi mật khẩu thành công!");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-full mb-6">
      <ChangePasswordHeader onBack={handleCancel} />

      <div className="max-w-4xl mx-auto p-0 px-4 md:px-0">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Đổi mật khẩu
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">
            Cập nhật mật khẩu của bạn để đảm bảo tính bảo mật cho tài khoản
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:py-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-xl">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  {success}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <PasswordInput
                required
                classNames={{
                  inputWrapper:
                    "bg-white dark:bg-zinc-800/50 border-gray-300 dark:border-zinc-700 h-11",
                  label: "text-gray-700 dark:text-zinc-400 font-normal",
                  input: "dark:text-white",
                }}
                label="Nhập mật khẩu hiện tại"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentPassword: e.target.value,
                  })
                }
              />

              <PasswordInput
                required
                classNames={{
                  inputWrapper:
                    "bg-white dark:bg-zinc-800/50 border-gray-300 dark:border-zinc-700 h-11",
                  label: "text-gray-700 dark:text-zinc-400 font-normal",
                  input: "dark:text-white",
                }}
                label="Nhập mật khẩu mới"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    newPassword: e.target.value,
                  })
                }
              />

              <PasswordInput
                required
                classNames={{
                  inputWrapper:
                    "bg-white dark:bg-zinc-800/50 border-gray-300 dark:border-zinc-700 h-11",
                  label: "text-gray-700 dark:text-zinc-400 font-normal",
                  input: "dark:text-white",
                }}
                label="Nhập lại mật khẩu mới"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <PasswordRequirements password={formData.newPassword} />

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-zinc-800 mt-8">
                <CustomButton
                  className="px-6 h-11 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-bold"
                  disabled={isLoading}
                  startContent={<RejectIcon className="w-5 h-5" />}
                  type="button"
                  variant="bordered"
                  onClick={handleCancel}
                >
                  Hủy
                </CustomButton>
                <CustomButton
                  className="px-6 h-11 bg-blue-600 dark:bg-primary hover:bg-blue-700 dark:hover:bg-primary-600 text-white font-bold"
                  color="primary"
                  disabled={isLoading}
                  isLoading={isLoading}
                  startContent={<DocumentIcon className="w-5 h-5" />}
                  type="submit"
                >
                  {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

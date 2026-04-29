"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { passwordSchema } from "@/schemas/password.schema";
import { RejectIcon, DocumentIcon } from "@/config/chip-and-icon";
import { CallToast } from "@/components/ui/CallToast";
import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/custom/CustomButton";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),

    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword.trim() === data.confirmPassword.trim(), {
    message: "Mật khẩu mới và xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const TOAST_DURATION = 3000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = changePasswordSchema.safeParse(formData);

    if (!result.success) {
      const errors: Partial<Record<keyof ChangePasswordFormData, string>> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ChangePasswordFormData;
        if (field) {
          errors[field] = err.message;
        }
      });

      setErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        CallToast({
          title: "Thất bại",
          message: data?.message || "Đổi mật khẩu thất bại",
          color: "danger",
        });
        return;
      }
      CallToast({
        title: "Thành công",
        message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
        color: "success",
      });

      setTimeout(() => router.push("/login"), TOAST_DURATION);
    } catch (err: any) {
      CallToast({
        title: "Thất bại",
        message: err?.response?.data?.message || "Đổi mật khẩu thất bại",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* HEADER */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Đổi mật khẩu
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 mt-1 text-sm">
            Cập nhật mật khẩu để bảo vệ tài khoản của bạn
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800">
          <form
            onSubmit={handleSubmit}
            className="px-6 py-8 md:px-10 md:py-10 space-y-6"
          >
            {/* OLD PASSWORD */}
            <PasswordInput
              required
              label="Mật khẩu hiện tại"
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              errorMessage={errors.oldPassword}
              isInvalid={!!errors.oldPassword}
            />

            {/* NEW PASSWORD */}
            <PasswordInput
              required
              label="Mật khẩu mới"
              value={formData.newPassword}
              onChange={(e) => {
                setFormData({ ...formData, newPassword: e.target.value });
                setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
              errorMessage={errors.newPassword}
              isInvalid={!!errors.newPassword}
            />

            {/* CONFIRM PASSWORD */}
            <PasswordInput
              required
              label="Xác nhận mật khẩu mới"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
              }}
              errorMessage={errors.confirmPassword}
              isInvalid={!!errors.confirmPassword}
            />

            {/* ACTION */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
              <CustomButton
                type="button"
                variant="bordered"
                onClick={handleCancel}
                disabled={isLoading}
                startContent={<RejectIcon className="w-5 h-5" />}
                className="h-11 px-6 font-bold border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300"
              >
                Hủy
              </CustomButton>

              <CustomButton
                type="submit"
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
                startContent={<DocumentIcon className="w-5 h-5" />}
                className="h-11 px-6 font-bold bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary-600 text-white"
              >
                {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

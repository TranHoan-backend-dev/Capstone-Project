"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { DocumentIcon } from "@/config/chip-and-icon";
import PasswordRequirements from "./PasswordRequirements";
import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/custom/CustomButton";
import { passwordSchema } from "@/schemas/password.schema";
import { resetPasswordService } from "@/services/auth.service";
import { CallToast } from "@/components/ui/CallToast";
import { useRouter } from "next/navigation";

interface ResetPasswordFormProps {
  email: string;
}

const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});

  const TOAST_DURATION = 3000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = resetPasswordSchema.safeParse({
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const errors: Partial<Record<keyof ResetPasswordFormData, string>> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ResetPasswordFormData;
        if (field) {
          errors[field] = err.message;
        }
      });

      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordService(email, formData.newPassword);
      CallToast({
        title: "Thành công",
        message: "Mật khẩu đã được đặt lại thành công",
        color: "success",
      });

      localStorage.removeItem("forgot_step");
      localStorage.removeItem("forgot_email");

      setTimeout(() => router.replace("/login"), TOAST_DURATION);
    } catch (err: any) {
      CallToast({
        title: "Thất bại",
        message:
          err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Đặt mật khẩu mới</h1>
        <p className="text-sm text-slate-600">
          Tạo một mật khẩu mạnh để bảo vệ tài khoản của bạn
        </p>
      </div>
      <div>
        <PasswordInput
          isRequired
          label="Nhập mật khẩu mới"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              newPassword: e.target.value,
            })
          }
          errorMessage={fieldErrors.newPassword}
          isInvalid={!!fieldErrors.newPassword}
        />
      </div>

      <div>
        <PasswordInput
          isRequired
          label="Nhập lại mật khẩu mới"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            })
          }
          errorMessage={fieldErrors.confirmPassword}
          isInvalid={!!fieldErrors.confirmPassword}
        />
      </div>

      <PasswordRequirements password={formData.newPassword} />

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-zinc-800 mt-8">
        <CustomButton
          className="px-6 h-11 bg-blue-600 dark:bg-primary hover:bg-blue-700 dark:hover:bg-primary-600 text-white font-bold"
          color="primary"
          disabled={isLoading}
          isLoading={isLoading}
          startContent={<DocumentIcon className="w-5 h-5" />}
          type="submit"
        >
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </CustomButton>
      </div>
    </form>
  );
};

export default ResetPasswordForm;

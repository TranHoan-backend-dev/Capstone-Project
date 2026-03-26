"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { DocumentIcon } from "@/config/chip-and-icon";
import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/custom/CustomButton";
import { passwordSchema } from "@/schemas/password.schema";
import { CallToast } from "@/components/ui/CallToast";
import { ResetPasswordFormProps } from "@/types";

const ResetPasswordForm = ({ email, otp }: ResetPasswordFormProps) => {
  const resetPasswordSchema = z
    .object({
      newPassword: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    });

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = resetPasswordSchema.safeParse({
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword: formData.newPassword,
        }),
      });

      if (!res.ok) {
        CallToast({
          title: "Thất bại",
          message: "Đặt lại mật khẩu thất bại",
          color: "danger",
        });
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      CallToast({
        title: "Thất bại",
        message: "Không thể kết nối tới server",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!otp) {
      localStorage.removeItem("forgot_step");
      localStorage.removeItem("forgot_email");

      CallToast({
        title: "Phiên hết hạn",
        message: "Vui lòng nhập lại email để tiếp tục.",
        color: "danger",
      });

      setTimeout(() => {
        window.location.href = "/forgot-password";
      }, 1500);
    }
  }, [otp]);

  useEffect(() => {
    if (success) {
      localStorage.removeItem("forgot_step");
      localStorage.removeItem("forgot_email");
    }
  }, [success]);

  if (success) {
    return (
      <div className="space-y-6 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Đổi mật khẩu thành công!
          </h1>
          <p className="text-sm text-slate-600">
            Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến
            trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

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
          isInvalid={!!errors.newPassword}
          errorMessage={errors.newPassword}
          onChange={(e) => {
            setFormData({
              ...formData,
              newPassword: e.target.value,
            });
            setErrors((prev) => ({ ...prev, newPassword: undefined }));
          }}
        />
      </div>

      <div>
        <PasswordInput
          isRequired
          label="Nhập lại mật khẩu mới"
          value={formData.confirmPassword}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          onChange={(e) => {
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            });
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-zinc-800 mt-8">
        <CustomButton
          className="px-6 h-11 bg-blue-600 dark:bg-primary hover:bg-blue-700 dark:hover:bg-primary-600 text-white font-bold"
          color="primary"
          disabled={isLoading}
          isLoading={isLoading}
          startContent={isLoading ? null : <DocumentIcon className="w-5 h-5" />}
          type="submit"
        >
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </CustomButton>
      </div>
    </form>
  );
};

export default ResetPasswordForm;

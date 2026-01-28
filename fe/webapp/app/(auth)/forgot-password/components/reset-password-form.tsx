"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { DocumentIcon } from "@/config/chip-and-icon";
import PasswordRequirements from "./PasswordRequirements";
import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/custom/CustomButton";
import { passwordSchema } from "@/schemas/password.schema";
import { resetPasswordService } from "@/services/auth.service";

interface ResetPasswordFormProps {
  email: string;
}

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const resetPasswordSchema = z
    .object({
      newPassword: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = resetPasswordSchema.safeParse({
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordService(email, formData.newPassword);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

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
          onChange={(e) =>
            setFormData({
              ...formData,
              newPassword: e.target.value,
            })
          }
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

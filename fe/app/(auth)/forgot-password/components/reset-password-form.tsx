"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";

import PasswordRequirements from "./PasswordRequirements";

import PasswordInput from "@/components/ui/PasswordInput";

interface ResetPasswordFormProps {
  email: string;
}

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every((v) => v);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Mật khẩu không đáp ứng các yêu cầu");

      return;
    }

    if (!passwordsMatch) {
      setError("Mật khẩu không khớp");

      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would call your API to reset password
      console.log("Resetting password for:", email);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

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
        <Button
          className="px-6 h-11 bg-blue-600 dark:bg-primary hover:bg-blue-700 dark:hover:bg-primary-600 text-white font-bold"
          color="primary"
          disabled={isLoading}
          isLoading={isLoading}
          startContent={<DocumentArrowDownIcon className="w-5 h-5" />}
          type="submit"
        >
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;

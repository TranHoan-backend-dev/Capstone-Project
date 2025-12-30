"use client";

import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordRequirements from "./PasswordRequirements";
import ForgotPasswordHeader from "./ForgotPasswordHeader";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import CustomInput from "@/components/ui/CustomInput";

const ForgotPasswordForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận không khớp");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setError("Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số");
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
      <ForgotPasswordHeader onBack={handleCancel} />

      <div className="max-w-4xl mx-auto p-0 px-4 md:px-0">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Quên mật khẩu</h2>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">
            Cập nhật mật khẩu của bạn để đảm bảo tính bảo mật cho tài khoản
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:py-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl">
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-xl">
                <p className="text-green-600 dark:text-green-400 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <CustomInput
                  label="Nhập email"
                  isRequired
                />
              </div>

              <div>
                <PasswordInput
                  label="Nhập mật khẩu mới"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newPassword: e.target.value,
                    })
                  }
                  isRequired
                />
              </div>

              <div>
                <PasswordInput
                  label="Nhập lại mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  isRequired
                />
              </div>

              <PasswordRequirements password={formData.newPassword} />

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-zinc-800 mt-8">
                <Button
                  type="button"
                  variant="bordered"
                  className="px-6 h-11 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-bold"
                  onClick={handleCancel}
                  disabled={isLoading}
                  startContent={<XMarkIcon className="w-5 h-5" />}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="px-6 h-11 bg-blue-600 dark:bg-primary hover:bg-blue-700 dark:hover:bg-primary-600 text-white font-bold"
                  isLoading={isLoading}
                  disabled={isLoading}
                  startContent={<DocumentArrowDownIcon className="w-5 h-5" />}
                >
                  {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

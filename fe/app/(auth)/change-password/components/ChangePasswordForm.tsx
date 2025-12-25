"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordRequirements from "./PasswordRequirements";
import ChangePasswordHeader from "./ChangePasswordHeader";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/solid";

export default function ChangePasswordForm() {
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
      <ChangePasswordHeader onBack={handleCancel} />

      <div className="max-w-4xl mx-auto p-0">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Đổi mật khẩu</h2>
          <p className="text-gray-600 mt-1">
            Cập nhật mật khẩu của bạn để đảm bảo tính bảo mật cho tài khoản
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Mật khẩu hiện tại
                </h3>
                <PasswordInput
                  label="Nhập mật khẩu hiện tại"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  classNames={{
                    inputWrapper: "bg-white border-gray-300",
                    label: "text-gray-700 font-normal",
                  }}
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Mật khẩu mới
                </h3>
                <PasswordInput
                  label="Nhập mật khẩu mới"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newPassword: e.target.value,
                    })
                  }
                  classNames={{
                    inputWrapper: "bg-white border-gray-300",
                    label: "text-gray-700 font-normal",
                  }}
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Xác nhận mật khẩu mới
                </h3>
                <PasswordInput
                  label="Nhập lại mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  classNames={{
                    inputWrapper: "bg-white border-gray-300",
                    label: "text-gray-700 font-normal",
                  }}
                  required
                />
              </div>

              <PasswordRequirements password={formData.newPassword} />

              <div className="flex justify-end space-x-4 pt-2">
                <Button
                  type="button"
                  variant="bordered"
                  className="px-2 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleCancel}
                  disabled={isLoading}
                  startContent={<XMarkIcon className="w-5 h-5" />}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="px-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white"
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
}

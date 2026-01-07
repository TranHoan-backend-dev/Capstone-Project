"use client";

import type React from "react";
import { z } from "zod";
import { useState } from "react";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomButton from "../../../../components/ui/custom/CustomButton";

interface ForgotPasswordFormProps {
  onSuccessAction: (email: string) => void;
}

export function ForgotPasswordForm({
  onSuccessAction,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Vui lòng nhập email hợp lệ")
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccessAction(email);
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Quên mật khẩu?</h1>
        <p className="text-sm text-slate-600">
          Nhập email của bạn và chúng tôi sẽ gửi mã xác nhận OTP
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <CustomInput
            required
            disabled={isLoading}
            id="email"
            label="Địa chỉ Email"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
        </div>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      </div>

      <CustomButton
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
        disabled={isLoading || !email}
        type="submit"
      >
        {isLoading ? <>Đang gửi...</> : "Gửi mã OTP"}
      </CustomButton>
    </form>
  );
}

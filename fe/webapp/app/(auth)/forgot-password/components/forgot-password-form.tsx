"use client";

import type React from "react";
import { z } from "zod";
import { useState } from "react";
import CustomButton from "../../../../components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CallToast } from "@/components/ui/CallToast";
import { ForgotPasswordFormProps } from "@/types";

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
      .email("Vui lòng nhập email hợp lệ"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      CallToast({
        title: "Thiếu thông tin",
        message: result.error.issues[0].message || "Vui lòng nhập email",
        color: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/check-existence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.data) {
        CallToast({
          title: "Sai thông tin",
          message: "Email không tồn tại trong hệ thống",
          color: "danger",
        });
        return;
      }
      onSuccessAction(email);
    } catch (err: any) {
      CallToast({
        title: "Thất bại",
        message: "Gửi email thất bại",
        color: "danger",
      });
    } finally {
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

"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "./components/forgot-password-form";
import OTPForm from "@/components/layout/OTPForm";
import ResetPasswordForm from "./components/reset-password-form";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("otp");
  };

  const handleOTPSubmit = () => {
    setStep("password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Bước {step === "email" ? "1" : step === "otp" ? "2" : "3"} / 3
            </div>
          </div>
          <div className="flex gap-2">
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step !== "email" ? "bg-blue-600" : "bg-blue-600"}`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step === "password" ? "bg-blue-600" : "bg-slate-300"}`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step === "password" ? "bg-blue-600" : "bg-slate-300"}`}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
          {step === "email" && (
            <ForgotPasswordForm onSuccess={handleEmailSubmit} />
          )}
          {step === "otp" && (
            <OTPForm
              email={email}
              onSuccess={handleOTPSubmit}
              onBack={() => setStep("email")}
            />
          )}
          {step === "password" && <ResetPasswordForm email={email} />}
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Bạn nhớ mật khẩu?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

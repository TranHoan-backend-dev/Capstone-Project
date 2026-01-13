"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Spinner } from "@heroui/react";

import { ForgotPasswordForm } from "./components/forgot-password-form";
import ResetPasswordForm from "./components/reset-password-form";

import OTPForm from "@/components/layout/OTPForm";

type ForgotStep = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("otp");
  };

  const handleOTPSubmit = () => {
    setStep("password");
  };

  useEffect(() => {
    const savedStep = localStorage.getItem("forgot_step") as ForgotStep | null;
    const savedEmail = localStorage.getItem("forgot_email");

    if (savedStep) setStep(savedStep);
    if (savedEmail) setEmail(savedEmail);

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("forgot_step", step);
  }, [step, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (email) localStorage.setItem("forgot_email", email);
  }, [email, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <ForgotPasswordForm onSuccessAction={handleEmailSubmit} />
          )}
          {step === "otp" && (
            <OTPForm
              email={email}
              onBackAction={() => setStep("email")}
              onSuccessAction={handleOTPSubmit}
            />
          )}
          {step === "password" && <ResetPasswordForm email={email} />}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Bạn nhớ mật khẩu?{" "}
            <Link
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              href="/login"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

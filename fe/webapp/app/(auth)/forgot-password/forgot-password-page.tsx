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
  const [otp, setOtp] = useState("");
  const STORAGE_KEY = "forgot_data";
  const EXPIRE_TIME = 5 * 60 * 1000;

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("otp");
  };

  const handleOTPSubmit = (verifiedOtp: string) => {
    setOtp(verifiedOtp);
    setStep("password");
  };

  useEffect(() => {
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;

    if (nav?.type === "reload") {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const data = JSON.parse(raw);

        const isExpired = Date.now() - data.time > EXPIRE_TIME;

        if (!isExpired) {
          setStep(data.step);
          setEmail(data.email);
          setOtp(data.otp || "");
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const payload = {
      step,
      email,
      otp,
      time: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [step, email, mounted]);

  useEffect(() => {
    if (step === "email") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [step]);

  useEffect(() => {
    if (step === "otp" && !email) {
      setStep("email");
    }

    if (step === "password" && (!email || !otp)) {
      setStep("email");
    }
  }, [step, email, otp]);
  
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
          {step === "password" && <ResetPasswordForm email={email} otp={otp} />}
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

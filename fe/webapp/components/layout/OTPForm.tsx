"use client";

import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RestoreIcon } from "@/config/chip-and-icon";
import CustomButton from "../ui/custom/CustomButton";
import CustomInput from "../ui/custom/CustomInput";
import { resendOtpService, verifyOtpService } from "@/services/auth.service";

interface OTPFormProps {
  email: string;
  onSuccessAction: () => void;
  onBackAction: () => void;
}

const OTP_LENGTH = 6;

const OTP_REGEX = new RegExp(`^\\d{${OTP_LENGTH}}$`);

export default function OTPForm({
  email,
  onSuccessAction,
  onBackAction,
}: OTPFormProps) {
  const otpSchema = z.object({
    otp: z
      .string()
      .length(OTP_LENGTH, `Vui lòng nhập đủ ${OTP_LENGTH} số OTP`)
      .regex(OTP_REGEX, "Mã OTP chỉ bao gồm chữ số"),
  });
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const pastedNumbers = pastedData
      .split("")
      .filter((char) => /^\d$/.test(char));

    if (pastedNumbers.length > 0) {
      const newOtp = [...otp];

      pastedNumbers.forEach((num, idx) => {
        if (idx < 6) {
          newOtp[idx] = num;
        }
      });
      setOtp(newOtp);

      const lastFilledIndex = Math.min(pastedNumbers.length - 1, 5);

      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpString = otp.join("");

    const result = otpSchema.safeParse({ otp: otpString });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      await verifyOtpService(email, otpString);

      onSuccessAction();
    } catch (err) {
      setError("Mã OTP không hợp lệ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleContainerClick = () => {
    const firstEmptyIndex = otp.findIndex((num) => num === "");

    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await resendOtpService(email);
      setCountdown(60);
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
    } catch {
      setError("Không thể gửi lại mã OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 bg-content1">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Xác thực Email
        </h2>
        <p className="text-default-600">
          Vui lòng nhập mã xác thực 6 số đã gửi đến
        </p>
        <p className="text-primary font-medium">{email}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-default-700 block text-center">
            Mã xác thực (6 số)
          </label>
          <div
            className="flex justify-center space-x-3"
            onClick={handleContainerClick}
            onPaste={handlePaste}
          >
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <CustomInput
                key={index}
                label=""
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-14 h-14 text-center text-xl font-semibold"
                classNames={{
                  input: "text-center text-xl font-semibold",
                  inputWrapper: `
                    h-14 w-14 border-2
                    ${otp[index] ? "border-primary" : "border-primary-100"}
                    data-[hover=true]:border-primary
                    data-[focus=true]:border-primary-600
                    bg-primary-50 dark:bg-primary-900/10
                  `,
                }}
                isDisabled={loading}
                maxLength={1}
                radius="lg"
                type="text"
                value={otp[index]}
                variant="bordered"
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <p className="text-xs text-default-500 text-center mt-2">
            Nhập 6 số bạn nhận được qua email
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <CustomButton
          className="w-full font-medium py-3 text-base"
          color="primary"
          isDisabled={loading || otp.join("").length !== OTP_LENGTH}
          isLoading={loading}
          type="submit"
        >
          {loading ? "Đang xác nhận..." : "Xác nhận"}
        </CustomButton>
      </form>

      <div className="flex flex-col items-center space-y-3">
        {countdown > 0 ? (
          <p className="text-sm text-slate-500">
            Gửi lại sau{" "}
            <span className="font-semibold text-slate-700">{countdown}s</span>
          </p>
        ) : (
          <button
            className="text-sm text-blue-600 hover:text-blue-700 font-medium 
                 flex items-center gap-1 transition-colors disabled:opacity-50"
            disabled={loading}
            type="button"
            onClick={handleResend}
          >
            <RestoreIcon className="w-3 h-3" />
            Gửi lại mã
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

interface OTPFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function OTPForm({ email, onSuccess, onBack }: OTPFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      setLoading(false);

      return;
    }

    try {
      console.log("OTP submitted:", otpString);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (otpString === "450123") {
        onSuccess();
        console.log("OTP hợp lệ!");
      } else {
        throw new Error("Mã OTP không đúng");
      }
    } catch (err) {
      setError("Mã OTP không hợp lệ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
    console.log("Resending OTP...");
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
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    console.log("Resending OTP to:", email);
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
        <p className="text-primary font-medium">raviweb@example.com</p>
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
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Input
                key={index}
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

        <Button
          className="w-full font-medium py-3 text-base"
          color="primary"
          isDisabled={otp.join("").length !== 6}
          isLoading={loading}
          type="submit"
        >
          {loading ? "Đang xác nhận..." : "Xác nhận"}
        </Button>
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
            <ArrowPathIcon className="w-3 h-3" />
            Gửi lại mã
          </button>
        )}
      </div>
    </div>
  );
}

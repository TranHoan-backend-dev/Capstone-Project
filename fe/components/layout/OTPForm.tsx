"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";

export default function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

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
        router.push("/change-password");
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

  return (
    <div className="max-w-md mx-auto mt-25 space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800">Xác thực Email</h2>
        <p className="text-gray-600">
          Vui lòng nhập mã xác thực 6 số đã gửi đến
        </p>
        <p className="text-blue-600 font-medium">raviweb@example.com</p>
        <div className="text-xs text-red-400">
          <p>Mã OTP sẽ hết hạn sau 60s</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block text-center">
            Mã xác thực (6 số)
          </label>
          <div
            className="flex justify-center space-x-3"
            onPaste={handlePaste}
            onClick={handleContainerClick}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-xl font-semibold"
                classNames={{
                  input: "text-center text-xl font-semibold",
                  inputWrapper: `
                    h-14 w-14 border-2
                    ${otp[index] ? "border-blue-500" : "border-blue-300"}
                    data-[hover=true]:border-blue-500
                    data-[focus=true]:border-blue-600
                    bg-blue-50
                  `,
                }}
                maxLength={1}
                variant="bordered"
                radius="lg"
                isDisabled={loading}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Nhập 6 số bạn nhận được qua email
          </p>
        </div>


        {error && <p className="text-red-500 text-sm text-center">{error}</p>}


        <Button
          type="submit"
          color="primary"
          className="w-full font-medium py-3 text-base"
          isLoading={loading}
          isDisabled={otp.join("").length !== 6}
        >
          {loading ? "Đang xác nhận..." : "Xác nhận"}
        </Button>
      </form>


      <div className="text-center space-y-3">
        <p className="text-sm text-gray-500">
          Không nhận được mã?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={handleResendOTP}
            disabled={loading}
          >
            Gửi lại
          </button>
        </p>
      </div>
    </div>
  );
}

"use client";

import { Form, Link } from "@heroui/react";
import { useRouter } from "next/navigation";

import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { ArrowRightStartIcon, AvatarIcon } from "@/config/chip-and-icon";
import { signinService } from "@/services/auth.service";
import { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      return;
    }
    setLoading(true);
    try {
      const data = await signinService({ username, password });
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/home");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm md:max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-black-900 dark:text-white mb-6 md:mb-8 text-center">
          Đăng nhập
        </h2>
        {error && (
          <p className="text-sm text-red-500 font-medium text-center">
            {error}
          </p>
        )}
        <Form className="space-y-4 md:space-y-3" onSubmit={handleLogin}>
          <CustomInput
            isRequired
            classNames={{
              label:
                "text-sm font-medium text-gray-700 dark:text-zinc-400 font-bold",
              input: "text-gray-900 dark:text-white",
              inputWrapper:
                "border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-gray-400 dark:hover:border-zinc-700 h-12",
            }}
            endContent={
              <div className="flex items-center h-full">
                <AvatarIcon className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              </div>
            }
            label="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <PasswordInput
            isRequired
            classNames={{
              label:
                "text-sm font-medium text-gray-700 dark:text-zinc-400 font-bold",
              input: "text-gray-900 dark:text-white",
              inputWrapper:
                "border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-gray-400 dark:hover:border-zinc-700 h-12",
            }}
            label="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="w-full pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              <CustomButton
                className="w-full bg-blue-600 dark:bg-primary text-white md:h-12 font-bold"
                color="primary"
                startContent={<ArrowRightStartIcon className="w-5 h-5" />}
                type="submit"
                isLoading={loading}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </CustomButton>
            </div>
          </div>

          <div className="w-full flex justify-center pt-2">
            <Link
              className="text-sm text-blue-600 dark:text-primary hover:text-blue-700 dark:hover:text-primary-400 font-medium"
              href="/forgot-password"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;

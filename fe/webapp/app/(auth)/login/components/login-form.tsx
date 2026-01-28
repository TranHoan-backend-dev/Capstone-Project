"use client";

import { Form, Link } from "@heroui/react";
import { useRouter } from "next/navigation";

import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { ArrowRightStartIcon, AvatarIcon } from "@/config/chip-and-icon";
import { useState } from "react";
import { CallToast } from "@/components/ui/CallToast";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      CallToast({
        title: "Thiếu thông tin",
        message:
          result.error.issues[0].message ||
          "Vui lòng nhập đầy đủ thông tin đăng nhập!",
        color: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      CallToast({
        title: "Thành công",
        message: "Đăng nhập thành công!",
        color: "success",
      });

      router.push("/home");
    } catch (err: any) {
      CallToast({
        title: "Thất bại",
        message: err.message || "Sai tên đăng nhập hoặc mật khẩu",
        color: "danger",
      });
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
        <Form className="space-y-4 md:space-y-3" onSubmit={handleLogin}>
          <CustomInput
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
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <PasswordInput
            classNames={{
              label:
                "text-sm font-medium text-gray-700 dark:text-zinc-400 font-bold",
              input: "text-gray-900 dark:text-white",
              inputWrapper:
                "border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-gray-400 dark:hover:border-zinc-700 h-12",
            }}
            label="Nhập mật khẩu"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
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

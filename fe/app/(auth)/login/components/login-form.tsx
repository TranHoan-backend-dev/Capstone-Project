"use client";

import { Form, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";

import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";

const LoginForm = () => {
  const router = useRouter();

  return (
    <div className="w-full md:w-1/2 h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm md:max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-black-900 dark:text-white mb-6 md:mb-8 text-center">
          Đăng nhập
        </h2>
        <Form className="space-y-4 md:space-y-3">
          <CustomInput
            isRequired
            label="Nhập tên đăng nhập"
            endContent={
              <div className="flex items-center h-full">
                <UserIcon className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              </div>
            }
          />
          <PasswordInput
            isRequired
            label="Nhập mật khẩu"
            classNames={{
              label: "text-sm font-medium text-gray-700 dark:text-zinc-400 font-bold",
              input: "text-gray-900 dark:text-white",
              inputWrapper:
                "border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-gray-400 dark:hover:border-zinc-700 h-12",
            }}
          />

          <div className="w-full pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              <CustomButton
                color="primary"
                type="submit"
                className="w-full bg-blue-600 dark:bg-primary text-white md:h-12 font-bold"
                startContent={
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                }
              >
                Đăng nhập
              </CustomButton>
            </div>
          </div>

          <div className="w-full flex justify-center pt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 dark:text-primary hover:text-blue-700 dark:hover:text-primary-400 font-medium"
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

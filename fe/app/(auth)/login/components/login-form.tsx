"use client";

import { Form, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";

import PasswordInput from "@/components/ui/PasswordInput";
import CustomButton from "@/components/ui/CustomButton";

const LoginForm = () => {
  const router = useRouter();

  return (
    <div className="w-full md:w-1/2 h-full bg-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm md:max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-black-900 mb-6 md:mb-8 text-center">
          Đăng nhập
        </h2>
        <Form className="space-y-4 md:space-y-3">
          <h3 className="text-sm font-medium text-gray-900 mb-0">Tên đăng nhập</h3>
          <Input
            isRequired
            label="Nhập tên đăng nhập"
            labelPlacement="inside"
            endContent={
              <div className="flex items-center h-full">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
            }
            classNames={{
              label: "text-sm font-medium text-gray-700",
              input: "text-gray-900",
              inputWrapper:
                "border border-gray-300 bg-white hover:border-gray-400",
            }}
          />
          <h3 className="text-sm font-medium text-gray-900 mb-0">Mật khẩu</h3>
          <PasswordInput
            isRequired
            label="Nhập mật khẩu"
            labelPlacement="inside"
            classNames={{
              label: "text-sm font-medium text-gray-700",
              input: "text-gray-900",
              inputWrapper:
                "border border-gray-300 bg-white hover:border-gray-400",
            }}
          />

          <div className="w-full pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              <CustomButton
                color="primary"
                type="submit"
                className="w-full bg-blue-600 text-white md:h-10"
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
              className="text-sm text-blue-600 hover:text-blue-700"
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

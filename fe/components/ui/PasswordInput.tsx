"use client";

import React, { useState } from "react";
import { Input, InputProps } from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface PasswordInputProps extends InputProps {
  placeholder?: string;
  label?: string;
}

const PasswordInput = ({
  placeholder,
  label,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      {...props}
      endContent={
        <div className="flex items-center h-full">
          <button
            aria-label="toggle password visibility"
            className="focus:outline-solid outline-transparent"
            type="button"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5 text-default-400" />
            ) : (
              <EyeIcon className="w-5 h-5 text-default-400" />
            )}
          </button>
        </div>
      }
      label={label}
      labelPlacement="inside"
      placeholder={placeholder}
      size="md"
      type={showPassword ? "text" : "password"}
    />
  );
};

export default PasswordInput;

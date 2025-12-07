"use client";

import React, { useState } from "react";
import { Input, InputProps } from "@heroui/react";

interface PasswordInputProps extends InputProps {
  placeholder: string;
  label?: string;
}

const PasswordInput = ({
  placeholder,
  label,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      size="md"
      placeholder={placeholder}
      type={showPassword ? "text" : "password"}
      label={label}
    />
  );
};

export default PasswordInput;

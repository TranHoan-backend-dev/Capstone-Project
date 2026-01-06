import { Input, InputProps } from "@heroui/react";
import React from "react";

interface CustomInputProps extends InputProps {
  type?: string;
  label: string;
}

const CustomInput = ({
  type = "text",
  label,
  isRequired,
  ...props
}: CustomInputProps) => {
  return (
    <Input
      isRequired={isRequired}
      label={label}
      labelPlacement="inside"
      radius="md"
      size="md"
      type={type}
      variant="bordered"
      {...props}
    />
  );
};

export default CustomInput;

"use client";

import { Textarea } from "@heroui/react";
import React from "react";

type CustomTextareaProps = React.ComponentProps<typeof Textarea> & {
  label: string;
  placeholder?: string;
  rows?: number;
};

const CustomTextarea = ({
  label,
  placeholder,
  rows,
  ...props
}: CustomTextareaProps) => {
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      variant="bordered"
      labelPlacement="inside"
      size="md"
      radius="md"
      minRows={rows}
      {...props}
    />
  );
};

export default CustomTextarea;

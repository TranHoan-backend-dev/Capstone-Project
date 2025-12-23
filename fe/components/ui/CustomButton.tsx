"use client";

import React from "react";
import { Button } from "@heroui/button";
import { cn } from "@/utils/cn";

interface Props extends Omit<React.ComponentProps<typeof Button>, "children"> {
  type?: "button" | "submit" | "reset";
  label?: string;
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
}

export default function CustomButton({
  type = "button",
  label,
  children,
  className,
  variant = "solid",
  ...props
}: Props) {
  return (
    <Button
      type={type}
      variant={variant}
      className={cn(
        "w-full h-10 rounded-xl px-3 py-1 font-medium transition",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children ?? label}
    </Button>
  );
}

"use client";

import {
  BellIcon,
  DocumentTextIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

const Actions = () => {
  const actions = [
    {
      label: "Tạo hóa đơn",
      icon: DocumentTextIcon,
      className:
        "bg-blue-600 dark:bg-primary text-white shadow-lg shadow-blue-100 dark:shadow-none",
      color: "primary" as const,
      variant: "solid" as const,
      href: "#",
    },
    {
      label: "In hóa đơn",
      icon: PrinterIcon,
      className:
        "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700",
      color: undefined,
      variant: "flat" as const,
      href: "#",
    },
    {
      label: "Gửi thông báo",
      icon: BellIcon,
      className:
        "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700",
      color: undefined,
      variant: "flat" as const,
      href: "#",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      {actions.map((action, index) => (
        <Button
          key={index}
          as={Link}
          className={`h-12 px-8 font-bold rounded-xl ${action.className}`}
          color={action.color}
          href={action.href}
          startContent={<action.icon className="w-5 h-5" />}
          variant={action.variant}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default Actions;

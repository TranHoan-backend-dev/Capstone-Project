"use client";

import React from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";

export interface BaseModalProps {
  isOpen: boolean | undefined;
  onOpenChange: (() => void) | undefined;
  title?: string;
  children: React.ReactNode;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  className?: string;
}

const BaseModal = ({
  isOpen,
  onOpenChange,
  title,
  children,
  size = "3xl",
  className,
}: BaseModalProps) => {
  return (
    <Modal
      className={className}
      classNames={{
        header:
          "bg-gradient-to-b from-[#f9f9f9] to-[#ececec] dark:from-default-100 dark:to-default-50 py-2 px-4 min-h-[40px] border-b border-divider",
        body: "p-4",
        closeButton:
          "top-2 right-2 text-black dark:text-foreground hover:bg-gray-200 dark:hover:bg-default-200 p-1 rounded-sm",
      }}
      isOpen={isOpen}
      radius="sm"
      size={size}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-[14px] font-bold text-[#333] dark:text-foreground">
            {title}
          </span>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BaseModal;

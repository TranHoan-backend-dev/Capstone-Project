"use client";

import React from "react";
import { Modal, ModalContent } from "@heroui/react";
import { Button } from "@heroui/react";
import CustomButton from "../custom/CustomButton";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger" | "success" | "warning";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title = "Xác nhận",
  message = "Bạn có chắc muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Huỷ",
  confirmColor = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>

          <p className="text-sm text-default-600">{message}</p>

          <div className="flex justify-end gap-3 pt-4">
            <CustomButton
              variant="light"
              onPress={onClose}
              isDisabled={isLoading}
            >
              {cancelText}
            </CustomButton>

            <CustomButton
              color={confirmColor}
              onPress={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </CustomButton>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
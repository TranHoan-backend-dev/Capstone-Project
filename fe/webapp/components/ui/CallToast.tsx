"use client";

import { CircularProgress, addToast } from "@heroui/react";

interface ToastProps {
  title?: string;
  message: string;
  color:
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | "foreground";
  isCircularProgress?: true;
}

const duration = 3000;

export const CallToast = ({
  title,
  message,
  color,
  isCircularProgress,
}: ToastProps) => {
  addToast({
    ...(title && { title }),
    ...(message && {
      description: (
        <div className="flex items-start gap-2 max-w-sm">
          {isCircularProgress && (
            <CircularProgress aria-label="Loading..." size="sm" />
          )}
          <span className="break-words whitespace-pre-wrap">{message}</span>
        </div>
      ),
    }),
    color: color,
    closeIcon: true,
    shouldShowTimeoutProgress: true,
    timeout: duration,
  });
};

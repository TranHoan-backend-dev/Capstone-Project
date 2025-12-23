import { CircularProgress } from "@heroui/progress";
import { addToast } from "@heroui/toast";

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
    description: (
      <div className="flex items-center gap-2">
        {isCircularProgress && (
          <CircularProgress size="sm" aria-label="Loading..." />
        )}
        <span>{message}</span>
      </div>
    ),
    color: color,
    closeIcon: true,
    shouldShowTimeoutProgress: true,
    timeout: duration,
  });
};

export type ConstructionStatus =
  | "PENDING_FOR_APPROVAL"
  | "PROCESSING"
  | "APPROVED";

export const getStatusText = (status?: string): string => {
  switch (status) {
    case "PENDING_FOR_APPROVAL":
      return "Chờ duyệt";
    case "PROCESSING":
      return "Đang xử lý";
    case "APPROVED":
      return "Đã duyệt";
    default:
      return "Chưa xác định";
  }
};

export const getStatusColor = (
  status?: string,
): "warning" | "primary" | "success" | "default" => {
  switch (status) {
    case "PENDING_FOR_APPROVAL":
      return "warning";
    case "PROCESSING":
      return "primary";
    case "APPROVED":
      return "success";
    default:
      return "default";
  }
};

export const getStatusVariant = (
  status?: string,
): "flat" | "solid" | "bordered" | "light" | "faded" => {
  return "flat";
};

export const getStatusInfo = (status?: string) => {
  return {
    text: getStatusText(status),
    color: getStatusColor(status),
    variant: getStatusVariant(status),
  };
};

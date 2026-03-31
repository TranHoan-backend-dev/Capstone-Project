import type { OrderStatus, OrderStage } from "@/types";

export const STAGES: { key: OrderStage; label: string }[] = [
  { key: "registration", label: "Đăng ký" },
  { key: "estimate", label: "Dự toán" },
  { key: "contract", label: "Hợp đồng" },
  { key: "construction", label: "Thi công" },
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Đang xử lý",
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Bị từ chối",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  processing: "bg-blue-500",
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
};

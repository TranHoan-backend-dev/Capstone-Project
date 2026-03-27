import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export interface Notification {
  id: string;
  sender: string;
  senderId?: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar: string;
  type: "message" | "system" | "sign-request" | "billing";
  action?: {
    type: string;
    id: string;
  };
}

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  relatedId?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
}

export const notificationService = {
  /**
   * Lấy danh sách thông báo
   */
  getNotifications: async (
    accessToken: string,
    page: number = 0,
    size: number = 20,
  ) => {
    return axios.get(`${API_GATEWAY_URL}/notifications`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Lấy thông báo chưa đọc
   */
  getUnreadNotifications: async (accessToken: string) => {
    return axios.get(`${API_GATEWAY_URL}/notifications/unread`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Đánh dấu thông báo là đã đọc
   */
  markAsRead: async (accessToken: string, notificationId: string) => {
    return axios.patch(
      `${API_GATEWAY_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: async (accessToken: string) => {
    return axios.patch(
      `${API_GATEWAY_URL}/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  /**
   * Xóa thông báo
   */
  deleteNotification: async (accessToken: string, notificationId: string) => {
    return axios.delete(
      `${API_GATEWAY_URL}/notifications/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  /**
   * Convert API response sang Notification format
   */
  convertToNotification: (response: NotificationResponse): Notification => {
    return {
      id: response.id,
      sender: response.sender?.fullname || "Hệ thống",
      senderId: response.sender?.id,
      message: response.content || response.title,
      time: formatTime(response.createdAt),
      isRead: response.isRead,
      avatar: response.sender?.avatarUrl || "",
      type: parseType(response.type),
      action:
        response.relatedId && response.metadata?.actionType
          ? {
              type: response.metadata.actionType,
              id: response.relatedId,
            }
          : undefined,
    };
  },
};

/**
 * Format thời gian hiển thị
 */
function formatTime(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  } catch {
    return "Vừa xong";
  }
}

/**
 * Parse loại notification từ API
 */
function parseType(
  apiType: string,
): "message" | "system" | "sign-request" | "billing" {
  if (apiType.includes("sign")) return "sign-request";
  if (apiType.includes("billing") || apiType.includes("payment"))
    return "billing";
  if (apiType.includes("message")) return "message";
  return "system";
}

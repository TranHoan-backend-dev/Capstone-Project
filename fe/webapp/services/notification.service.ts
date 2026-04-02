import { API_GATEWAY_URL, SOCKET_URL } from "@/utils/constraints";
import axios from "axios";

export interface GetNotificationsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface NotificationResponseDto {
  notificationId: string;
  title: string;
  message: string;
  link?: string;
  status: boolean; // false = unread, true = read
  createdAt: string;
}

export interface NotificationBatchResponseDto {
  items: NotificationResponseDto[];
  requestedSize: number;
  totalFound: number;
}

export interface Notification {
  id: string;
  sender: string;
  senderId?: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar: string;
  type:
    | "device_login"
    | "message"
    | "system"
    | "billing"
    | "security"
    | "sign-request";
  action?: {
    type: string;
    id: string;
  };
  metadata?: {
    deviceInfo?: string;
    ipAddress?: string;
    loginTime?: string;
    location?: string;
    estimateId?: string;
    status?: string;
    estimateNumber?: string;
    projectName?: string;
    estimateAmount?: number;
    [key: string]: any;
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
    return axios.get(`${SOCKET_URL}/n/ws`, {
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
    return axios.get(`${SOCKET_URL}/n/unread`, {
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
      `${SOCKET_URL}/n/${notificationId}/read`,
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
      `${SOCKET_URL}/n/read-all`,
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
    return axios.delete(`${SOCKET_URL}/n/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
):
  | "message"
  | "system"
  | "sign-request"
  | "billing"
  | "device_login"
  | "security" {
  if (apiType.includes("sign")) return "sign-request";
  if (apiType.includes("billing") || apiType.includes("payment"))
    return "billing";
  if (apiType.includes("message")) return "message";
  if (apiType.includes("device") || apiType.includes("login"))
    return "device_login";
  if (apiType.includes("security")) return "security";
  return "system";
}

/**
 * Service để xử lý và transform Notification data từ WebSocket
 * Support để tất cả loại notification types
 */

import { Notification } from "@/services/notification.service";

export interface SignRequestNotificationPayload {
  id: string;
  estimateId: string;
  projectId?: string;
  sender: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
  type: "sign-request";
  message: string;
  status: string; // PENDING, APPROVED, REJECTED
  requiredSignatures: Array<{
    userId: string;
    role: string;
    signed: boolean;
  }>;
  createdAt: string;
  metadata?: {
    estimateNumber?: string;
    projectName?: string;
    estimateAmount?: number;
  };
}

export interface DeviceLoginNotificationPayload {
  id: string;
  sender: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
  type: "device_login";
  message: string;
  metadata: {
    deviceInfo: string;
    ipAddress: string;
    location: string;
    loginTime: string;
  };
  createdAt: string;
}

export interface SystemNotificationPayload {
  id: string;
  sender?: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
  type: "system";
  message: string;
  content?: string;
  isRead?: boolean;
  status?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export type NotificationPayload =
  | SignRequestNotificationPayload
  | DeviceLoginNotificationPayload
  | SystemNotificationPayload
  | Record<string, any>;

export const notificationAdapter = {
  /**
   * Transform SignRequest notification từ backend format thành UI format
   */
  transformSignRequestNotification(
    payload: SignRequestNotificationPayload,
  ): Notification {
    return {
      id: payload.id,
      sender: payload.sender.fullname,
      senderId: payload.sender.id,
      message: payload.message,
      time: formatRelativeTime(new Date(payload.createdAt)),
      isRead: false,
      avatar: payload.sender.avatarUrl || "",
      type: "sign-request",
      action: {
        type: "view_signature_request",
        id: payload.estimateId,
      },
      metadata: {
        ...payload.metadata,
        estimateId: payload.estimateId,
        status: payload.status,
        deviceInfo: undefined,
        ipAddress: undefined,
        loginTime: undefined,
        location: undefined,
      },
    };
  },

  /**
   * Transform DeviceLogin notification
   */
  transformDeviceLoginNotification(
    payload: DeviceLoginNotificationPayload,
  ): Notification {
    return {
      id: payload.id,
      sender: payload.sender.fullname,
      senderId: payload.sender.id,
      message: payload.message,
      time: formatRelativeTime(new Date(payload.createdAt)),
      isRead: false,
      avatar: payload.sender.avatarUrl || "",
      type: "device_login",
      metadata: {
        deviceInfo: payload.metadata.deviceInfo,
        ipAddress: payload.metadata.ipAddress,
        location: payload.metadata.location,
        loginTime: payload.metadata.loginTime,
      },
    };
  },

  /**
   * Transform System notification
   */
  transformSystemNotification(
    payload: SystemNotificationPayload,
  ): Notification {
    return {
      id: payload.id,
      sender: payload.sender?.fullname || "Hệ thống",
      senderId: payload.sender?.id,
      message: payload.message || payload.content || "",
      time: formatRelativeTime(new Date(payload.createdAt)),
      isRead: payload.isRead || false,
      avatar: payload.sender?.avatarUrl || "",
      type: "system",
      metadata: payload.metadata || {},
    };
  },

  /**
   * Transform any notification based on type
   */
  transform(payload: NotificationPayload): Notification {
    switch (payload.type) {
      case "sign-request":
        return this.transformSignRequestNotification(
          payload as SignRequestNotificationPayload,
        );
      case "device_login":
        return this.transformDeviceLoginNotification(
          payload as DeviceLoginNotificationPayload,
        );
      case "system":
        return this.transformSystemNotification(
          payload as SystemNotificationPayload,
        );
      default:
        // Generic transformation for unknown types
        return {
          id: (payload as any).id,
          sender:
            (payload as any).sender?.fullname ||
            (payload as any).sender ||
            "Hệ thống",
          senderId: (payload as any).sender?.id,
          message: (payload as any).message || (payload as any).content || "",
          time: formatRelativeTime(
            new Date((payload as any).createdAt || new Date()),
          ),
          isRead: (payload as any).isRead || false,
          avatar: (payload as any).sender?.avatarUrl || "",
          type: (payload as any).type || "system",
          metadata: (payload as any).metadata || {},
        };
    }
  },

  /**
   * Transform array of notifications
   */
  transformMultiple(payloads: NotificationPayload[]): Notification[] {
    return payloads.map((payload) => this.transform(payload));
  },
};

/**
 * Helper function to format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return "Vừa xong";
  } else if (diffMins < 60) {
    return `${diffMins} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} tuần trước`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} tháng trước`;
  } else {
    return date.toLocaleDateString("vi-VN");
  }
}

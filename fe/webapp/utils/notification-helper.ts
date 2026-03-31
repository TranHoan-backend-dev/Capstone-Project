/**
 * Utility functions for notification handling
 */

/**
 * Format date to relative time in Vietnamese
 * e.g., "2 phút trước", "1 giờ trước", "3 ngày trước"
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) {
    return "Vừa xong";
  } else if (diffMins < 60) {
    return `${diffMins} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} tuần trước`;
  } else if (diffMonths < 12) {
    return `${diffMonths} tháng trước`;
  } else {
    return date.toLocaleDateString("vi-VN");
  }
};

import axios from "axios";
import { API_GATEWAY_URL } from "@/utils/constraints";

export interface SendNotificationPayload {
  recipientIds: string[]; // IDs của những user sẽ nhận thông báo
  title: string;
  message: string;
  type: "sign-request" | "system" | "billing" | "message";
  relatedId?: string; // ID của settlement hoặc related resource
  metadata?: Record<string, any>;
}

/**
 * Gửi notification tới nhiều users
 */
export const sendNotificationToUsers = async (
  accessToken: string,
  payload: SendNotificationPayload,
) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY_URL}/notifications/send`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};

/**
 * Gửi notification yêu cầu ký duyệt
 */
export const sendSignRequestNotification = async (
  accessToken: string,
  recipientIds: string[],
  settlementId: string,
  settlementFormNumber: string,
  requesterName: string,
) => {
  return sendNotificationToUsers(accessToken, {
    recipientIds,
    title: "Yêu cầu ký duyệt quyết toán",
    message: `${requesterName} đã gửi yêu cầu ký duyệt quyết toán: ${settlementFormNumber}`,
    type: "sign-request",
    relatedId: settlementId,
    metadata: {
      settlementId,
      settlementFormNumber,
      requesterName,
      actionType: "review_and_sign",
    },
  });
};

/**
 * Gửi bulk notification
 */
export const sendBulkNotification = async (
  accessToken: string,
  notifications: SendNotificationPayload[],
) => {
  try {
    const promises = notifications.map((notif) =>
      sendNotificationToUsers(accessToken, notif),
    );
    const results = await Promise.allSettled(promises);

    console.log("Bulk notification results:", results);
    return results;
  } catch (error) {
    console.error("Failed to send bulk notifications:", error);
    throw error;
  }
};

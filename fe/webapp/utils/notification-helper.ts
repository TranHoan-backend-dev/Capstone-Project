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

import axios from "axios";

import { API_GATEWAY_URL } from "@/utils/constraints";

export const getAllNotifications = (
  accessToken: string,
  page: number,
  size: number,
) =>
  axios.get(`${API_GATEWAY_URL}/n/notification`, {
    params: {
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getUnreadCount = (accessToken: string) =>
  axios.get(`${API_GATEWAY_URL}/n/notification/unread-count`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const markAsRead = (accessToken: string, notificationId: string) =>
  axios.patch(
    `${API_GATEWAY_URL}/n/notification/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

export const deleteNotification = (
  accessToken: string,
  notificationId: string,
) =>
  axios.delete(`${API_GATEWAY_URL}/n/notification/${notificationId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

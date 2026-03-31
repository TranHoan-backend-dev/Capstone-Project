import { API_GATEWAY_URL } from "@/utils/constraints";
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

/**
 * Fetch notifications for the current user
 * @param accessToken JWT access token
 * @param params Pagination and sorting parameters
 */
export const getNotifications = (
  accessToken: string,
  params: GetNotificationsParams = { page: 0, size: 20, sort: "createdAt,desc" },
) =>
  axios.get(`${API_GATEWAY_URL}/n/ws`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { websocketService } from "@/services/websocket.service";
import {
  notificationService,
  Notification,
  NotificationResponse,
} from "@/services/notification.service";
import { useProfile } from "@/hooks/useLogin";
import { getAccessToken } from "@/utils/getAccessToken";
import { useServerInsertedHTML } from "next/navigation";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /**
   * Khởi tạo WebSocket connection
   */
  useEffect(() => {
    if (!profile?.id) return;

    const initWebSocket = async () => {
      try {
        // Lấy access token từ cookies
        // Tạm thời sử dụng một placeholder, sẽ được cập nhật khi có request
        const accessToken = getAccessTokenFromCookie();

        if (!accessToken) {
          console.warn("No access token found");
          setLoading(false);
          return;
        }

        await websocketService.connect(accessToken);
        setIsConnected(true);

        // Subscribe tới thông báo ký duyệt
        websocketService.subscribe(
          "SETTLEMENT_SIGN_REQUEST",
          handleSignRequest,
        );

        // Subscribe tới thông báo ký duyệt thành công
        websocketService.subscribe("SETTLEMENT_SIGNED", handleSettlementSigned);

        // Subscribe tới thông báo chung
        websocketService.subscribe("NOTIFICATION", handleNewNotification);

        // Lấy thông báo ban đầu
        await refreshNotifications();
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
        setIsConnected(false);
        setLoading(false);
      }
    };

    initWebSocket();

    return () => {
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, [profile?.id]);

  /**
   * Xử lý thông báo yêu cầu ký duyệt
   */
  const handleSignRequest = useCallback((data: any) => {
    console.log("📨 Sign request notification:", data);
    const notification: Notification = {
      id: `sign-${Date.now()}`,
      sender: data.requesterName || "Hệ thống",
      senderId: data.requesterId,
      message: `Yêu cầu ký duyệt quyết toán: ${data.settlementFormNumber || ""}`,
      time: "Vừa xong",
      isRead: false,
      avatar: data.requesterAvatar || "",
      type: "sign-request",
      action: {
        type: "sign_settlement",
        id: data.settlementId,
      },
    };
    addNotifiable(notification);
  }, []);

  /**
   * Xử lý thông báo ký duyệt thành công
   */
  const handleSettlementSigned = useCallback((data: any) => {
    console.log("✅ Settlement signed notification:", data);
    const notification: Notification = {
      id: `signed-${Date.now()}`,
      sender: data.signerName || "Hệ thống",
      senderId: data.signerId,
      message: `${data.signerName || "Ai đó"} đã ký duyệt quyết toán: ${data.settlementFormNumber || ""}`,
      time: "Vừa xong",
      isRead: false,
      avatar: data.signerAvatar || "",
      type: "system",
    };
    addNotifiable(notification);
  }, []);

  /**
   * Xử lý thông báo chung
   */
  const handleNewNotification = useCallback((data: any) => {
    console.log("📬 New notification:", data);
    const notification: Notification = notificationService.convertToNotification(
      data as NotificationResponse,
    );
    addNotifiable(notification);
  }, []);

  /**
   * Thêm thông báo vào state
   */
  const addNotifiable = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const addNotification = (notification: Notification) => {
    addNotifiable(notification);
  };

  /**
   * Lấy lại danh sách thông báo
   */
  const refreshNotifications = async () => {
    try {
      const accessToken = getAccessTokenFromCookie();
      if (!accessToken) return;

      const response = await notificationService.getNotifications(
        accessToken,
        0,
        50,
      );

      if (response.data?.data) {
        const converted = response.data.data.map(
          (n: NotificationResponse) =>
            notificationService.convertToNotification(n),
        );
        setNotifications(converted);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đánh dấu thông báo là đã đọc
   */
  const markAsRead = async (id: string) => {
    try {
      const accessToken = getAccessTokenFromCookie();
      if (!accessToken) return;

      await notificationService.markAsRead(accessToken, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  const markAllAsRead = async () => {
    try {
      const accessToken = getAccessTokenFromCookie();
      if (!accessToken) return;

      await notificationService.markAllAsRead(accessToken);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true })),
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  /**
   * Xóa thông báo
   */
  const deleteNotification = async (id: string) => {
    try {
      const accessToken = getAccessTokenFromCookie();
      if (!accessToken) return;

      await notificationService.deleteNotification(accessToken, id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Helper function: Lấy access token từ cookies
 * (Sử dụng từ getAccessToken utility hoặc direct từ document.cookie)
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "access_token" || key === "__Secure-access_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

import { useEffect, useState, useCallback, useRef } from "react";
import { websocketService } from "@/services/websocket-stomp.service";
import {
  notificationService,
  Notification,
} from "@/services/notification.service";
import { notificationAdapter } from "@/services/notification-adapter.service";
import { getClientAccessToken } from "@/utils/getClientAccessToken";

export interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  unreadCount: number;
  hasMore: boolean;
  totalCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useNotifications = (
  pageSize: number = 20,
): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Get token on mount
  useEffect(() => {
    const initToken = async () => {
      const token = await getClientAccessToken();
      setAccessToken(token);
      setIsAuthenticated(!!token);
    };
    initToken();
  }, []);

  // Helper function to ensure we have a valid token
  const getValidToken = useCallback(async (): Promise<string> => {
    if (!accessToken) {
      // Try to get token again if not available
      const token = await getClientAccessToken();
      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);
        return token;
      }
      throw new Error("No access token available");
    }
    return accessToken;
  }, [accessToken]);

  // Load notifications from API
  const loadNotifications = useCallback(
    async (page: number, isLoadMore = false) => {
      if (!isAuthenticated && !accessToken) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const token = await getValidToken();
        const response = await notificationService.getNotifications(
          token,
          page,
          pageSize,
        );

        const items = response.data?.items || response.data?.data || [];
        const total =
          response.data?.total || response.data?.totalCount || items.length;

        const transformed = notificationAdapter.transformMultiple(items);

        setNotifications((prev) =>
          isLoadMore ? [...prev, ...transformed] : transformed,
        );
        setTotalCount(total);
        setHasMore((page + 1) * pageSize < total);
        setCurrentPage(page);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load notifications:", err);
        setError(err.message || "Lỗi khi tải thông báo");

        if (!isLoadMore) {
          setNotifications([]);
          setTotalCount(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize, getValidToken, isAuthenticated, accessToken],
  );

  const refresh = useCallback(async () => {
    await loadNotifications(0, false);
  }, [loadNotifications]);

  const loadMore = useCallback(async () => {
    if (!loadingMore && hasMore && !loading && isAuthenticated) {
      await loadNotifications(currentPage + 1, true);
    }
  }, [
    loadingMore,
    hasMore,
    currentPage,
    loadNotifications,
    loading,
    isAuthenticated,
  ]);

  // Kết nối WebSocket và subscribe vào notification
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      console.log("Not authenticated, skipping WebSocket connection");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const initWebSocket = async () => {
      try {
        // Connect WebSocket
        await websocketService.connect(accessToken);

        if (!isMounted) return;
        setIsConnected(true);

        // Subscribe vào notification messages
        unsubscribeRef.current = websocketService.subscribe(
          "notification",
          (data: any) => {
            if (!isMounted) return;

            console.log("📨 New notification received:", data);

            // Transform notification using adapter
            const newNotification = notificationAdapter.transform(data);

            // Thêm notification vào đầu danh sách
            setNotifications((prev) => {
              const exists = prev.find((n) => n.id === newNotification.id);
              if (exists) return prev;
              return [newNotification, ...prev];
            });

            setTotalCount((prev) => prev + 1);
          },
        );

        // Load initial notifications
        await loadNotifications(0, false);
      } catch (err: any) {
        console.error("Failed to initialize WebSocket:", err);

        if (!isMounted) return;
        setError(err.message || "Lỗi khi kết nối");
        setIsConnected(false);

        // Fallback: Load notification từ API nếu WebSocket thất bại
        try {
          await loadNotifications(0, false);
        } catch (fallbackErr) {
          console.error("Fallback loading also failed:", fallbackErr);
        }
      }
    };

    initWebSocket();

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (websocketService.disconnect) {
        websocketService.disconnect();
      }
    };
  }, [accessToken, isAuthenticated, loadNotifications]);

  // Đánh dấu thông báo là đã đọc
  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!notificationId) {
        console.error("Notification ID is required");
        return;
      }

      if (!isAuthenticated) {
        console.error("User not authenticated");
        return;
      }

      try {
        const token = await getValidToken();
        await notificationService.markAsRead(token, notificationId);

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        throw err;
      }
    },
    [getValidToken, isAuthenticated],
  );

  // Xóa thông báo
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      if (!notificationId) {
        console.error("Notification ID is required");
        return;
      }

      if (!isAuthenticated) {
        console.error("User not authenticated");
        return;
      }

      try {
        const token = await getValidToken();
        await notificationService.deleteNotification(token, notificationId);

        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setTotalCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to delete notification:", err);
        throw err;
      }
    },
    [getValidToken, isAuthenticated],
  );

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("User not authenticated");
      return;
    }

    const unreadNotifications = notifications.filter((n) => !n.isRead);

    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      const token = await getValidToken();

      await Promise.all(
        unreadNotifications.map((n) =>
          notificationService.markAsRead(token, n.id),
        ),
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      throw err;
    }
  }, [notifications, getValidToken, isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    isConnected,
    unreadCount,
    hasMore,
    totalCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    loadMore,
    refresh,
  };
};

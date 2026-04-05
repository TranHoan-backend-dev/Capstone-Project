import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Badge,
  Avatar,
  ScrollShadow,
  Button,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import {
  BellIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  ComputerDesktopIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useWebSocket } from "@/context/WebSocketContext";

// Interface cho response từ API
interface ApiNotification {
  notificationId: string;
  title: string;
  message: string;
  status: boolean; // false = unread, true = read
  createdAt: string;
  link: string | null;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link: string | null;
  time: string;
}

// Helper function để format thời gian
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
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
};

// Lấy icon dựa trên title
const getNotificationIcon = (title: string) => {
  if (title?.toLowerCase().includes("ký")) {
    return <DocumentTextIcon className="w-3.5 h-3.5 text-white" />;
  }
  if (title?.toLowerCase().includes("hệ thống")) {
    return <ComputerDesktopIcon className="w-3.5 h-3.5 text-white" />;
  }
  return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
};

// Lấy màu icon dựa trên title
const getNotificationIconColor = (title: string) => {
  if (title?.toLowerCase().includes("ký")) {
    return "bg-purple-600";
  }
  if (title?.toLowerCase().includes("hệ thống")) {
    return "bg-blue-600";
  }
  return "bg-orange-600";
};

// Transform notification từ WebSocket hoặc API
const transformNotification = (item: any): Notification => ({
  id: item.notificationId || item.id,
  title: item.title || "Thông báo mới",
  message: item.message || item.body || "",
  isRead: item.status === true || item.read === true,
  createdAt: item.createdAt || item.timestamp || new Date().toISOString(),
  link: item.link || null,
  time: formatTime(
    item.createdAt || item.timestamp || new Date().toISOString(),
  ),
});

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [lastNotification, setLastNotification] = useState<Notification | null>(
    null,
  );

  // WebSocket context
  const { isConnected, connectionError, reconnect, subscribe, unsubscribe } =
    useWebSocket();

  // Modal states
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalTotalPages, setModalTotalPages] = useState(0);
  const [modalFilter, setModalFilter] = useState<"all" | "unread">("all");
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isModalLoadingMore, setIsModalLoadingMore] = useState(false);
  const [modalHasError, setModalHasError] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout>();

  // Xử lý thông báo mới từ WebSocket
  const handleNewNotification = useCallback(
    (newNotification: any) => {
      console.log("🔔 New notification received:", newNotification);

      const transformed = transformNotification(newNotification);

      // Thêm vào danh sách notifications
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === transformed.id);
        if (exists) return prev;
        return [transformed, ...prev];
      });

      // Cập nhật allNotifications nếu modal đang mở
      if (isModalOpen) {
        setAllNotifications((prev) => {
          const exists = prev.some((n) => n.id === transformed.id);
          if (exists) return prev;
          return [transformed, ...prev];
        });
      }

      // Hiển thị alert tạm thời
      setLastNotification(transformed);
      setShowNotificationAlert(true);

      // Tự động ẩn alert sau 5 giây
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
      alertTimeoutRef.current = setTimeout(() => {
        setShowNotificationAlert(false);
        setLastNotification(null);
      }, 5000);

      // Phát âm thanh thông báo
      if (audioRef.current && document.visibilityState === "visible") {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }

      // Hiển thị browser notification
      if (
        Notification.permission === "granted" &&
        document.visibilityState === "hidden"
      ) {
        new Notification(transformed.title, {
          body: transformed.message,
          icon: "/notification-icon.png",
          silent: false,
        });
      }

      // Tăng badge count trên tab
      const currentUnreadCount = notifications.filter((n) => !n.isRead).length;
      if (document.visibilityState === "hidden") {
        document.title = `🔔 (${currentUnreadCount + 1}) ${document.title.replace(/^🔔 \(\d+\) /, "")}`;
      }
    },
    [isModalOpen, notifications],
  );

  // Subscribe WebSocket topics
  useEffect(() => {
    const handleNotification = (notification: any) => {
      handleNewNotification(notification);
    };

    // Subscribe to user-specific queue
    subscribe("/user/queue/notifications", handleNotification);
    // Subscribe to general topic
    subscribe("/topic/notifications", handleNotification);
  }, [subscribe, unsubscribe, handleNewNotification]);

  // Reset title khi focus vào tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        document.title = document.title.replace(/^🔔 \(\d+\) /, "");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Auto reconnect on error
  useEffect(() => {
    if (connectionError) {
      const timeout = setTimeout(() => {
        console.log("Attempting to reconnect WebSocket...");
        reconnect();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [connectionError, reconnect]);

  // Fetch notifications từ API
  const fetchNotifications = useCallback(
    async (page: number, isLoadMore = false) => {
      if (!isLoadMore) {
        setIsInitialLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setHasError(false);

      try {
        const response = await fetch(`/api/notifications?page=0&size=5`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data;
        const items = data?.items || [];
        const totalFound = data?.totalFound || 0;

        const transformedNotifications: Notification[] = items.map(
          transformNotification,
        );

        if (isLoadMore) {
          setNotifications((prev) => [...prev, ...transformedNotifications]);
        } else {
          setNotifications(transformedNotifications);
        }

        const pages = Math.ceil(totalFound / 10);
        setTotalPages(pages);
        setTotalElements(totalFound);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setHasError(true);
      } finally {
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  // Fetch all notifications cho modal
  const fetchAllNotifications = useCallback(
    async (page: number, isLoadMore = false) => {
      if (!isLoadMore) {
        setIsModalLoading(true);
      } else {
        setIsModalLoadingMore(true);
      }
      setModalHasError(false);

      try {
        const response = await fetch(
          `/api/notifications?page=${page - 1}&size=10`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data;
        const items = data?.items || [];
        const totalFound = data?.totalFound || 0;

        const transformedNotifications: Notification[] = items.map(
          transformNotification,
        );

        if (isLoadMore) {
          setAllNotifications((prev) => [...prev, ...transformedNotifications]);
        } else {
          setAllNotifications(transformedNotifications);
        }

        const pages = Math.ceil(totalFound / 10);
        setModalTotalPages(pages);
        setModalCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch all notifications:", error);
        setModalHasError(true);
      } finally {
        setIsModalLoading(false);
        setIsModalLoadingMore(false);
      }
    },
    [],
  );

  // Load more when scrolling (dropdown)
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const isBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (
        isBottom &&
        !isLoadingMore &&
        !isInitialLoading &&
        currentPage < totalPages
      ) {
        fetchNotifications(currentPage + 1, true);
      }
    },
    [
      isLoadingMore,
      isInitialLoading,
      currentPage,
      totalPages,
      fetchNotifications,
    ],
  );

  // Load more when scrolling (modal)
  const handleModalScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const isBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (
        isBottom &&
        !isModalLoadingMore &&
        !isModalLoading &&
        modalCurrentPage < modalTotalPages
      ) {
        fetchAllNotifications(modalCurrentPage + 1, true);
      }
    },
    [
      isModalLoadingMore,
      isModalLoading,
      modalCurrentPage,
      modalTotalPages,
      fetchAllNotifications,
    ],
  );

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
        setAllNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setAllNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true })),
        );
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId),
          );
          setAllNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId),
          );
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [],
  );

  // Load initial data when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0 && !hasError) {
      fetchNotifications(1, false);
    }
  }, [isOpen, fetchNotifications, notifications.length, hasError]);

  // Load initial data when modal opens
  useEffect(() => {
    if (isModalOpen && allNotifications.length === 0 && !modalHasError) {
      fetchAllNotifications(1, false);
    }
  }, [
    isModalOpen,
    fetchAllNotifications,
    allNotifications.length,
    modalHasError,
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

  // Format message display
  const formatMessage = (notification: Notification) => {
    return (
      <div>
        <p className="text-[14px] leading-[1.3]">
          <span className="font-bold text-foreground">
            {notification.title}
          </span>
          <span className={!notification.isRead ? "font-bold" : "font-medium"}>
            {" - "}
            {notification.message}
          </span>
        </p>
      </div>
    );
  };

  // Render content based on state
  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <div className="flex flex-col py-2 px-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="flex items-center gap-3 px-3 py-3 mb-1"
            >
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-3 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="py-20 text-center px-4">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-danger-400 mb-3" />
          <p className="font-bold text-default-600">Không thể tải thông báo</p>
          <Button
            className="mt-4"
            size="sm"
            onClick={() => fetchNotifications(1, false)}
          >
            Thử lại
          </Button>
        </div>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <div className="py-20 text-center text-default-400 px-4">
          <BellIcon className="w-12 h-12 mx-auto opacity-20 mb-3" />
          <p className="font-bold text-default-500">
            {filter === "all"
              ? "Không có thông báo nào"
              : "Không có thông báo chưa đọc"}
          </p>
          <p className="text-sm">
            {filter === "all"
              ? "Khi có thông báo mới, bạn sẽ thấy ở đây"
              : "Bạn đã đọc tất cả thông báo"}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col py-4 px-2">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all rounded-xl relative group hover:bg-default-50 mb-1 ${
              !n.isRead ? "bg-primary-50" : ""
            }`}
            onClick={() => markAsRead(n.id)}
          >
            <div className="relative shrink-0">
              <Avatar
                className="bg-primary-50 text-primary font-bold"
                name={n.title.charAt(0)}
                size="lg"
              />
              <div
                className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-background ${getNotificationIconColor(n.title)}`}
              >
                {getNotificationIcon(n.title)}
              </div>
            </div>
            <div className="flex-1 min-w-0 pr-4">
              {formatMessage(n)}
              <p
                className={`text-[12px] mt-1 ${
                  !n.isRead
                    ? "text-primary font-bold"
                    : "text-default-400 font-medium"
                }`}
              >
                {n.time}
              </p>
            </div>
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                isIconOnly
                className="hover:bg-danger-50 text-danger"
                radius="full"
                size="sm"
                variant="light"
                onClick={(e) => deleteNotification(n.id, e)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
            {!n.isRead && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-primary rounded-full" />
              </div>
            )}
          </div>
        ))}
        {isLoadingMore && (
          <div className="p-6 text-center">
            <div className="inline-block w-6 h-6 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  };

  // Render modal content
  const renderModalContent = () => {
    if (isModalLoading) {
      return (
        <div className="flex flex-col py-4 px-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`modal-skeleton-${i}`}
              className="flex items-center gap-3 p-3 border border-divider rounded-xl"
            >
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-3 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (modalHasError) {
      return (
        <div className="py-12 text-center px-4">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-danger-400 mb-3" />
          <p className="font-bold text-default-600">Không thể tải thông báo</p>
          <Button
            className="mt-4"
            size="sm"
            onClick={() => fetchAllNotifications(1, false)}
          >
            Thử lại
          </Button>
        </div>
      );
    }

    const filteredModalNotifications =
      modalFilter === "all"
        ? allNotifications
        : allNotifications.filter((n) => !n.isRead);

    if (filteredModalNotifications.length === 0) {
      return (
        <div className="py-12 text-center text-default-400 px-4">
          <BellIcon className="w-12 h-12 mx-auto opacity-20 mb-3" />
          <p className="font-bold text-default-500">
            {modalFilter === "all"
              ? "Không có thông báo nào"
              : "Không có thông báo chưa đọc"}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {filteredModalNotifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl relative group hover:bg-default-50 border border-divider ${
              !n.isRead ? "bg-primary-50" : ""
            }`}
            onClick={() => markAsRead(n.id)}
          >
            <div className="relative shrink-0">
              <Avatar
                className="bg-primary-50 text-primary font-bold"
                name={n.title.charAt(0)}
                size="lg"
              />
              <div
                className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-background ${getNotificationIconColor(n.title)}`}
              >
                {getNotificationIcon(n.title)}
              </div>
            </div>
            <div className="flex-1 min-w-0 pr-4">
              {formatMessage(n)}
              <p
                className={`text-[12px] mt-1 ${
                  !n.isRead
                    ? "text-primary font-bold"
                    : "text-default-400 font-medium"
                }`}
              >
                {n.time}
              </p>
            </div>
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                isIconOnly
                className="hover:bg-danger-50 text-danger"
                radius="full"
                size="sm"
                variant="light"
                onClick={(e) => deleteNotification(n.id, e)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
            {!n.isRead && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-primary rounded-full" />
              </div>
            )}
          </div>
        ))}
        {isModalLoadingMore && (
          <div className="p-6 text-center">
            <div className="inline-block w-6 h-6 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating notification alert */}
      {showNotificationAlert && lastNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-l-4 border-primary p-4 min-w-[300px] max-w-md">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <Avatar
                  className="bg-primary-50 text-primary font-bold"
                  name={lastNotification.title.charAt(0)}
                  size="md"
                />
                <div
                  className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-white dark:border-gray-800 ${getNotificationIconColor(lastNotification.title)}`}
                >
                  {getNotificationIcon(lastNotification.title)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">
                  {lastNotification.title}
                </p>
                <p className="text-sm text-default-600 line-clamp-2">
                  {lastNotification.message}
                </p>
                <p className="text-xs text-default-400 mt-1">
                  {lastNotification.time}
                </p>
              </div>
              <button
                onClick={() => setShowNotificationAlert(false)}
                className="text-default-400 hover:text-default-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dropdown
        className="p-0"
        placement="bottom-end"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            className="w-12 h-12 relative text-default-600 hover:bg-default-100"
            radius="full"
            variant="light"
          >
            <Badge
              className={
                unreadCount === 0 ? "hidden" : "border-2 border-background"
              }
              color="danger"
              content={unreadCount >= 5 ? "5+" : unreadCount}
              shape="circle"
              size="sm"
              placement="top-right"
            >
              <BellIcon className="w-6 h-6 text-default-600" />
              {/* WebSocket connection status indicator */}
              {isConnected && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background z-20 animate-pulse" />
              )}
              {connectionError && !isConnected && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background z-20" />
              )}
            </Badge>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Notifications"
          className="w-[360px] md:w-[400px] p-0 overflow-visible rounded-2xl shadow-2xl border border-divider bg-content1"
          variant="light"
        >
          {/* Header Section */}
          <DropdownSection
            aria-label="Header"
            classNames={{
              base: "w-full p-0 flex flex-col",
              group: "p-0",
            }}
          >
            <DropdownItem
              key="header"
              isReadOnly
              className="p-0 opacity-100 cursor-default focus:bg-transparent"
            >
              <div className="flex flex-col gap-4 px-4 pt-4 pb-2 border-b border-divider bg-content1 rounded-t-2xl pointer-events-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-foreground tracking-tight">
                      Thông báo
                    </span>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-green-700">
                          Trực tuyến
                        </span>
                      </div>
                    ) : connectionError ? (
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-full cursor-pointer hover:bg-red-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          reconnect();
                        }}
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-xs font-bold text-red-700">
                          Mất kết nối - Nhấn để kết nối lại
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-yellow-700">
                          Đang kết nối...
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {unreadCount > 0 && (
                      <Button
                        size="sm"
                        variant="light"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllAsRead();
                        }}
                      >
                        Đọc tất cả
                      </Button>
                    )}
                    <Button
                      isIconOnly
                      className="hover:bg-default-100"
                      radius="full"
                      size="sm"
                      variant="light"
                    >
                      <EllipsisHorizontalIcon className="w-6 h-6 text-default-600" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className={`font-bold px-4 text-sm ${
                      filter === "all"
                        ? "bg-primary-50 text-primary"
                        : "bg-transparent text-default-600 hover:bg-default-100"
                    }`}
                    radius="full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter("all");
                    }}
                  >
                    Tất cả ({totalElements})
                  </Button>
                  <Button
                    className={`font-bold px-4 text-sm ${
                      filter === "unread"
                        ? "bg-primary-50 text-primary"
                        : "bg-transparent text-default-600 hover:bg-default-100"
                    }`}
                    radius="full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter("unread");
                    }}
                  >
                    Chưa đọc
                    {unreadCount > 0 && (
                      <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </DropdownItem>
          </DropdownSection>

          {/* Notification List Section */}
          <DropdownSection
            aria-label="Notification list"
            classNames={{
              base: "w-full p-0 flex flex-col",
              group: "p-0",
            }}
          >
            <DropdownItem
              key="scroll-container"
              className="p-0 hover:bg-transparent cursor-default focus:bg-transparent"
              textValue="Notifications list"
            >
              <ScrollShadow
                hideScrollBar
                ref={scrollRef}
                className="max-h-[520px] w-full"
                onScroll={handleScroll}
              >
                {renderContent()}
              </ScrollShadow>
            </DropdownItem>
          </DropdownSection>

          {/* Footer Section */}
          {/* Footer Section */}
          {!isInitialLoading && !hasError && notifications.length > 0 ? (
            <DropdownSection
              aria-label="Footer"
              classNames={{
                base: "p-2 border-t border-divider bg-content1 rounded-b-2xl",
                group: "p-0",
              }}
            >
              <DropdownItem
                key="view-all"
                className="p-0 text-center text-sm font-bold text-primary hover:text-primary-600 hover:bg-primary-50/50 rounded-xl transition-colors"
                onClick={() => onModalOpen()}
              >
                <span className="block py-2.5">Xem tất cả thông báo</span>
              </DropdownItem>
            </DropdownSection>
          ) : null}
        </DropdownMenu>
      </Dropdown>

      {/* Modal for viewing all notifications */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        size="2xl"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          closeButton: "top-4 right-4 z-50",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-3 border-b border-divider">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-foreground tracking-tight">
                    Tất cả thông báo
                  </h2>
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2">
                  <Button
                    className={`font-bold px-4 text-sm ${
                      modalFilter === "all"
                        ? "bg-primary-50 text-primary"
                        : "bg-transparent text-default-600 hover:bg-default-100"
                    }`}
                    radius="full"
                    size="sm"
                    onClick={() => setModalFilter("all")}
                  >
                    Tất cả
                  </Button>
                  <Button
                    className={`font-bold px-4 text-sm ${
                      modalFilter === "unread"
                        ? "bg-primary-50 text-primary"
                        : "bg-transparent text-default-600 hover:bg-default-100"
                    }`}
                    radius="full"
                    size="sm"
                    onClick={() => setModalFilter("unread")}
                  >
                    Chưa đọc
                  </Button>
                </div>
              </ModalHeader>

              <ModalBody className="p-4">
                <ScrollShadow
                  hideScrollBar
                  ref={modalScrollRef}
                  className="overflow-y-auto max-h-[60vh]"
                  onScroll={handleModalScroll}
                >
                  {renderModalContent()}
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default NotificationDropdown;

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
} from "@heroui/react";
import {
  BellIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Interface cho response từ API
interface ApiNotification {
  id: string;
  title?: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

interface Notification {
  id: string;
  sender: string;
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
  metadata?: {
    deviceInfo?: string;
    ipAddress?: string;
    loginTime?: string;
    location?: string;
  };
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

// Helper function để map type từ API
const mapNotificationType = (type: string): Notification["type"] => {
  const typeMap: Record<string, Notification["type"]> = {
    DEVICE_LOGIN: "device_login",
    MESSAGE: "message",
    SYSTEM: "system",
    BILLING: "billing",
    SECURITY: "security",
    SIGN_REQUEST: "sign-request",
  };
  return typeMap[type] || "message";
};

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
  const [isConnected] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

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
        const response = await fetch(`/api/notifications?page=${page}&size=10`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API response to component's notification format
        const transformedNotifications: Notification[] = (
          data.content ||
          data.data ||
          []
        ).map((item: ApiNotification) => ({
          id: item.id,
          sender: item.sender?.name || item.title || "Hệ thống",
          message: item.content,
          time: formatTime(item.createdAt),
          isRead: item.isRead,
          avatar: item.sender?.avatar || "",
          type: mapNotificationType(item.type),
          metadata: item.metadata,
        }));

        if (isLoadMore) {
          setNotifications((prev) => [...prev, ...transformedNotifications]);
        } else {
          setNotifications(transformedNotifications);
        }

        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 10));
        setTotalElements(data.totalElements || data.total || 0);
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

  // Load more when scrolling
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

  // Lấy background color theo loại thông báo
  const getNotificationBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "sign-request":
        return "bg-purple-100";
      case "system":
        return "bg-blue-100";
      case "billing":
        return "bg-green-100";
      case "device_login":
        return "bg-indigo-100";
      case "security":
        return "bg-red-100";
      case "message":
      default:
        return "bg-orange-100";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

  // Lấy icon color theo loại thông báo
  const getNotificationIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "sign-request":
        return "bg-purple-600";
      case "system":
        return "bg-blue-600";
      case "billing":
        return "bg-green-600";
      case "device_login":
        return "bg-indigo-600";
      case "security":
        return "bg-red-600";
      case "message":
      default:
        return "bg-orange-600";
    }
  };

  // Lấy icon component theo loại thông báo
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "sign-request":
        return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
      case "system":
        return <ComputerDesktopIcon className="w-3.5 h-3.5 text-white" />;
      case "billing":
        return <CurrencyDollarIcon className="w-3.5 h-3.5 text-white" />;
      case "device_login":
        return <ComputerDesktopIcon className="w-3.5 h-3.5 text-white" />;
      case "security":
        return <ShieldCheckIcon className="w-3.5 h-3.5 text-white" />;
      case "message":
      default:
        return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
    }
  };

  const formatMessage = (notification: Notification) => {
    if (notification.type === "device_login" && notification.metadata) {
      return (
        <div>
          <p className="text-[14px] leading-[1.3]">
            <span className="font-bold text-foreground">
              {notification.sender}
            </span>{" "}
            <span
              className={!notification.isRead ? "font-bold" : "font-medium"}
            >
              {notification.message}
            </span>
          </p>
          {notification.metadata.location && (
            <p className="text-[11px] text-default-400 mt-1">
              {notification.metadata.location} •{" "}
              {notification.metadata.deviceInfo}
            </p>
          )}
        </div>
      );
    }

    return (
      <p
        className={`text-[14px] leading-[1.3] ${
          !notification.isRead
            ? "font-bold text-foreground"
            : "text-default-600 font-medium"
        }`}
      >
        <span className="text-foreground">{notification.sender}</span>{" "}
        {notification.message}
      </p>
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
      <div className="flex flex-col py-2 px-2">
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
                className={
                  !n.avatar
                    ? "bg-primary-50 text-primary font-bold"
                    : "border border-divider"
                }
                name={n.sender}
                size="lg"
                src={n.avatar}
              />
              <div
                className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-background ${getNotificationIconColor(n.type)}`}
              >
                {getNotificationIcon(n.type)}
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

  return (
    <Dropdown
      className="p-0"
      placement="bottom-end"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          className="relative text-default-600 hover:bg-default-100"
          radius="full"
          variant="light"
        >
          <Badge
            className={
              unreadCount === 0 ? "hidden" : "border-2 border-background"
            }
            color="danger"
            content={unreadCount > 99 ? "99+" : unreadCount}
            shape="circle"
            size="sm"
          >
            <BellIcon className="w-6 h-6 text-default-600" />
          </Badge>
          {isConnected && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-600 rounded-full border border-background" />
          )}
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
                  {isConnected && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-green-700">
                        Trực tuyến
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

        {/* Footer Section - Only show when there are notifications */}
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
            >
              <span className="block py-2.5">Xem tất cả thông báo</span>
            </DropdownItem>
          </DropdownSection>
        ) : null}
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;

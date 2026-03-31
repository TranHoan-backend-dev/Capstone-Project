"use client";

import React, { useState, useEffect } from "react";
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
  Spinner,
} from "@heroui/react";
import {
  BellIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatRelativeTime } from "@/utils/notification-helper";
import { NotificationResponseDto } from "@/services/notification.service";

interface Notification {
  id: string;
  sender: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar: string;
  type: "device_login" | "message" | "system" | "billing" | "security" | "sign-request";
  metadata?: {
    deviceInfo?: string;
    ipAddress?: string;
    loginTime?: string;
    location?: string;
  };
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isConnected] = useState(true);

  /**
   * Convert backend notification to UI format
   */
  const mapNotificationToUI = (dto: NotificationResponseDto): Notification => {
    return {
      id: dto.notificationId,
      sender: dto.title,
      message: dto.message,
      time: formatRelativeTime(dto.createdAt),
      isRead: dto.status,
      avatar: "",
      type: "system",
    };
  };
  /**
   * Fetch notifications từ API
   */
  const fetchNotifications = async (
    page: number = 0,
    append: boolean = false,
  ) => {
    try {
      if (page === 0) {
        setIsInitialLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setHasError(false);

      const response = await fetch(
        `/api/notification?page=${page}&size=20&sort=createdAt,desc`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const result = await response.json();
      const notificationData = result.data as {
        items: NotificationResponseDto[];
        requestedSize: number;
        totalFound: number;
      };

      const uiNotifications = notificationData.items.map(mapNotificationToUI);

      if (append) {
        setNotifications((prev) => [...prev, ...uiNotifications]);
      } else {
        setNotifications(uiNotifications);
      }

      setTotalFound(notificationData.totalFound);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setHasError(true);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };
  /**
   * Initial load
   */
  useEffect(() => {
    fetchNotifications(0);
    
    // Polling mỗi 30 giây để lấy thông báo mới
    const interval = setInterval(() => {
      fetchNotifications(0, false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 10 &&
      !isLoadingMore &&
      !isInitialLoading &&
      filter === "all" &&
      currentPage * 20 < totalFound
    ) {
      fetchNotifications(currentPage + 1, true);
    }
  };

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
        return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
      case "billing":
        return <CurrencyDollarIcon className="w-3.5 h-3.5 text-white" />;
      case "device_login":
        return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
      case "security":
        return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
      case "message":
      default:
        return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
    }
  };

  // Lấy label loại thông báo
  const getNotificationTypeLabel = (type: Notification["type"]) => {
    switch (type) {
      case "sign-request":
        return "Yêu cầu ký";
      case "system":
        return "Hệ thống";
      case "billing":
        return "Thanh toán";
      case "device_login":
        return "Đăng nhập";
      case "security":
        return "Bảo mật";
      case "message":
      default:
        return "Tin nhắn";
    }
  };

  /**
   * Format message để hiển thị đẹp hơn
   */
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
              📍 {notification.metadata.location} •{" "}
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
  }

  return (
    <Dropdown className="p-0" placement="bottom-end">
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
                        handleMarkAllAsRead();
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
                  Tất cả ({notifications.length})
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
            <ScrollShadow hideScrollBar className="max-h-[520px] w-full" onScroll={handleScroll}>
              <div className="flex flex-col py-2 px-2">
                {isInitialLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
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
                  ))
                ) : filteredNotifications.length === 0 ? (
                  // Empty state
                  <div className="py-20 text-center text-default-400 px-4">
                    <BellIcon className="w-12 h-12 mx-auto opacity-20 mb-3" />
                    <p className="font-bold text-default-500">
                      Không có thông báo mới
                    </p>
                    <p className="text-sm">
                      Khi có bình luận hoặc tin nhắn, bạn sẽ thấy ở đây.
                    </p>
                  </div>
                ) : (
                  // Notification list
                  <>
                    {filteredNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all rounded-xl relative group hover:bg-default-50 mb-1 ${
                          !n.isRead ? "bg-primary-50" : ""
                        }`}
                        onClick={() => !n.isRead && handleMarkAsRead(n.id)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(n.id);
                          }}
                        >
                          <Button
                            isIconOnly
                            className="hover:bg-danger-50 text-danger"
                            radius="full"
                            size="sm"
                            variant="light"
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
                  </>
                )}
              </div>
            </ScrollShadow>
          </DropdownItem>
        </DropdownSection>

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
      </DropdownMenu>
    </Dropdown>
  );
};
export default NotificationDropdown;

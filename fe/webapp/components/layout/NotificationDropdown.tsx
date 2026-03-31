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
} from "@heroui/react";
import {
  BellIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { formatRelativeTime } from "@/utils/notification-helper";

interface NotificationResponseDto {
  notificationId: string;
  title: string;
  message: string;
  link?: string;
  status: boolean; // false = unread, true = read
  createdAt: string;
}

interface Notification {
  id: string;
  sender: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar: string;
  type: "device_login" | "message" | "system" | "billing" | "security";
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
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Fetch notifications từ API
  // const fetchNotifications = async (pageNum: number = 1, append: boolean = false) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`/api/notifications?page=${pageNum}&limit=10`);
  //     const data = await response.json();

  //     if (response.ok) {
  //       const newNotifications = data.notifications || [];
  //       if (append) {
  //         setNotifications(prev => [...prev, ...newNotifications]);
  //       } else {
  //         setNotifications(newNotifications);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Lỗi lấy thông báo:", error);
  //     // Fallback to mock data nếu API chưa có
  //     setNotifications(getMockNotifications());
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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
  // Mock data cho development
  const getMockNotifications = (): Notification[] => {
    return [
      {
        id: "1",
        sender: "Hệ thống bảo mật",
        message: "Đăng nhập từ thiết bị mới: Chrome trên Windows 11",
        time: "2 phút trước",
        isRead: false,
        avatar: "",
        type: "device_login",
        metadata: {
          deviceInfo: "Chrome 120.0, Windows 11",
          ipAddress: "192.168.1.100",
          loginTime: new Date().toLocaleString(),
          location: "Hà Nội, Việt Nam",
        },
      },
      {
        id: "2",
        sender: "Hệ thống",
        message: "Đơn hàng 01025120007 của bạn đã được thanh toán thành công.",
        time: "2 phút trước",
        isRead: false,
        avatar: "",
        type: "system",
      },
      {
        id: "3",
        sender: "Cảnh báo bảo mật",
        message: "Phát hiện đăng nhập từ thiết bị lạ tại TP. Hồ Chí Minh",
        time: "1 giờ trước",
        isRead: false,
        avatar: "",
        type: "security",
        metadata: {
          deviceInfo: "Safari trên iPhone 14",
          ipAddress: "183.81.123.45",
          loginTime: "1 giờ trước",
          location: "TP. Hồ Chí Minh",
        },
      },
      {
        id: "4",
        sender: "Trần Thị Nguyệt",
        message: "Đã gửi một yêu cầu khảo sát thiết kế mới.",
        time: "1 giờ trước",
        isRead: false,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        type: "message",
      },
      {
        id: "5",
        sender: "Phòng Kế toán",
        message: "Thông báo chốt số nước tháng 12/2025.",
        time: "3 giờ trước",
        isRead: true,
        avatar: "",
        type: "billing",
      },
      {
        id: "6",
        sender: "Hệ thống",
        message: "Đăng nhập thành công từ thiết bị đã tin cậy",
        time: "Hôm qua",
        isRead: true,
        avatar: "",
        type: "device_login",
        metadata: {
          deviceInfo: "Firefox trên macOS",
          ipAddress: "10.0.0.105",
          loginTime: "Hôm qua",
          location: "Đà Nẵng",
        },
      },
    ];
  };

  useEffect(() => {
    fetchNotifications(1, false);
    // Polling mỗi 30 giây để lấy thông báo mới
    const interval = setInterval(() => {
      fetchNotifications(1, false);
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

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
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
      console.error("Lỗi đánh dấu tất cả:", error);
    }
  };
  /**
   * Convert backend notification to UI format
   */
  const mapNotificationToUI = (dto: NotificationResponseDto): Notification => {
    return {
      id: dto.notificationId,
      sender: dto.title, // Use title as sender
      message: dto.message,
      time: formatRelativeTime(dto.createdAt),
      isRead: dto.status, // true = read, so isRead = status
      avatar: "", // No avatar from backend
      type: "system", // All notifications from backend are system type
    };
  };

  /**
   * Initial load
   */
  useEffect(() => {
    fetchNotifications(0);
  }, []);

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 10 &&
      !isLoadingMore &&
      !isInitialLoading &&
      filter === "all"
    ) {
      // Load more
      setPage((prev) => prev + 1);
      fetchNotifications(page + 1, true);
    }
  };

  // Lấy icon theo loại thông báo
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "device_login":
        return <ComputerDesktopIcon className="w-3.5 h-3.5 text-blue-600" />;
      case "security":
        return <ShieldCheckIcon className="w-3.5 h-3.5 text-red-600" />;
      case "billing":
        return <CurrencyDollarIcon className="w-3.5 h-3.5 text-green-600" />;
      default:
        return <CheckCircleIcon className="w-3.5 h-3.5 text-orange-600" />;
    }
  };

  // Lấy màu nền cho icon theo loại
  const getIconBgColor = (type: string) => {
    switch (type) {
      case "device_login":
        return "bg-blue-100";
      case "security":
        return "bg-red-100";
      case "billing":
        return "bg-green-100";
      default:
        return "bg-orange-100";
    }
  };

  // Format message để hiển thị đẹp hơn
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
        className={`text-[14px] leading-[1.3] ${!notification.isRead ? "font-bold text-foreground" : "text-default-600 font-medium"}`}
      >
        <span className="text-foreground">{notification.sender}</span>{" "}
        {notification.message}
      </p>
    );
    // Check if there are more notifications to load
    const nextPage = currentPage + 1;
    const totalPages = Math.ceil(totalFound / 20);

    if (nextPage < totalPages) {
      fetchNotifications(nextPage, true); // Append mode
    }
  };

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
                <span className="text-2xl font-black text-foreground tracking-tight">
                  Thông báo
                </span>
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
                  className={`font-bold px-4 ${filter === "all" ? "bg-primary-50 text-primary" : "bg-transparent text-default-600 hover:bg-default-100"}`}
                  radius="full"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter("all");
                  }}
                >
                  Tất cả
                </Button>
                <Button
                  className={`font-bold px-4 ${filter === "unread" ? "bg-primary-50 text-primary" : "bg-transparent text-default-600 hover:bg-default-100"}`}
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
            <ScrollShadow
              hideScrollBar
              className="max-h-[520px] w-full"
              onScroll={handleScroll}
            >
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
                        className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all rounded-xl relative group hover:bg-default-50 mb-1`}
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
                            className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-background ${n.type === "system" ? "bg-blue-600" : n.type === "billing" ? "bg-green-600" : "bg-orange-600"}`}
                          >
                            {n.type === "message" ? (
                              <div className="w-2.5 h-2.5 bg-white rounded-full" />
                            ) : (
                              <CheckCircleIcon className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <p
                            className={`text-[14px] leading-[1.3] ${!n.isRead ? "font-bold text-foreground" : "text-default-600 font-medium"}`}
                          >
                            <span className="text-foreground">{n.sender}</span>{" "}
                            {n.message}
                          </p>
                          <p
                            className={`text-[12px] mt-1 ${!n.isRead ? "text-primary font-bold" : "text-default-400 font-medium"}`}
                          >
                            {n.time}
                          </p>
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

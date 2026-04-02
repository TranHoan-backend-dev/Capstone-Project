"use client";

import React, { useState, useCallback, useRef } from "react";
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
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/services/notification.service";

const NotificationDropdown = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useNotifications(20);

  // Lấy background color theo loại thông báo
  const getNotificationBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "sign-request":
        return "bg-purple-100 dark:bg-purple-900/30";
      case "system":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "billing":
        return "bg-green-100 dark:bg-green-900/30";
      case "device_login":
        return "bg-indigo-100 dark:bg-indigo-900/30";
      case "security":
        return "bg-red-100 dark:bg-red-900/30";
      case "message":
      default:
        return "bg-orange-100 dark:bg-orange-900/30";
    }
  };

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
    return <CheckCircleIcon className="w-3.5 h-3.5 text-white" />;
  };

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }

      // Handle navigation based on notification type
      if (notification.action?.type === "view_signature_request") {
        // Navigate to signature request
        console.log("Navigate to:", notification.action.id);
      }

      setIsOpen(false);
    },
    [markAsRead],
  );

  const handleDelete = useCallback(
    async (e: React.MouseEvent, notificationId: string) => {
      e.stopPropagation();
      await deleteNotification(notificationId);
    },
    [deleteNotification],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (bottom && hasMore && !loading) {
        loadMore();
      }
    },
    [hasMore, loading, loadMore],
  );

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

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
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-600 rounded-full border-2 border-background" />
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
            <div className="flex flex-col gap-4 px-4 pt-4 pb-2 border-b border-divider bg-content1 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-foreground tracking-tight">
                    Thông báo
                  </span>
                  {isConnected && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-green-700 dark:text-green-400">
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
                      onClick={handleMarkAllAsRead}
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
                    onClick={() => refresh()}
                  >
                    <EllipsisHorizontalIcon className="w-6 h-6 text-default-600" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className={`font-bold px-4 text-sm ${
                    filter === "all"
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary"
                      : "bg-transparent text-default-600 hover:bg-default-100"
                  }`}
                  radius="full"
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Tất cả ({totalCount})
                </Button>
                <Button
                  className={`font-bold px-4 text-sm ${
                    filter === "unread"
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary"
                      : "bg-transparent text-default-600 hover:bg-default-100"
                  }`}
                  radius="full"
                  size="sm"
                  onClick={() => setFilter("unread")}
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
              ref={scrollRef}
            >
              <div className="flex flex-col py-2 px-2">
                {loading && filteredNotifications.length === 0 ? (
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
                ) : error ? (
                  <div className="py-20 text-center text-danger-400 px-4">
                    <p className="font-bold">Lỗi tải thông báo</p>
                    <p className="text-sm mt-2">{error}</p>
                    <Button
                      className="mt-4"
                      size="sm"
                      color="primary"
                      onClick={refresh}
                    >
                      Thử lại
                    </Button>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  // Empty state
                  <div className="py-20 text-center text-default-400 px-4">
                    <BellIcon className="w-12 h-12 mx-auto opacity-20 mb-3" />
                    <p className="font-bold text-default-500">
                      {filter === "all"
                        ? "Không có thông báo"
                        : "Không có thông báo chưa đọc"}
                    </p>
                    <p className="text-sm">
                      {filter === "all"
                        ? "Bạn sẽ thấy thông báo khi có hoạt động mới"
                        : "Tất cả thông báo đã được đọc"}
                    </p>
                  </div>
                ) : (
                  // Notification list
                  <>
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 px-3 py-3 cursor-pointer transition-all rounded-xl relative group hover:bg-default-100 mb-1 ${
                          !notification.isRead
                            ? "bg-primary-50 dark:bg-primary-900/20"
                            : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="relative shrink-0">
                          <Avatar
                            className={
                              !notification.avatar
                                ? "bg-primary-50 text-primary font-bold"
                                : "border border-divider"
                            }
                            name={notification.sender}
                            size="lg"
                            src={notification.avatar}
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-background ${getNotificationIconColor(notification.type)}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex flex-col gap-1">
                            <p
                              className={`text-sm leading-tight ${
                                !notification.isRead
                                  ? "font-semibold text-foreground"
                                  : "text-default-600"
                              }`}
                            >
                              <span className="font-bold">
                                {notification.sender}
                              </span>{" "}
                              {notification.message}
                            </p>
                            {notification.metadata?.location && (
                              <p className="text-xs text-default-400">
                                {notification.metadata.location} •{" "}
                                {notification.metadata.deviceInfo}
                              </p>
                            )}
                            <p
                              className={`text-xs mt-1 ${
                                !notification.isRead
                                  ? "text-primary font-medium"
                                  : "text-default-400"
                              }`}
                            >
                              {notification.time}
                            </p>
                          </div>
                        </div>
                        <div
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={(e) => handleDelete(e, notification.id)}
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
                        {!notification.isRead && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          </div>
                        )}
                      </div>
                    ))}
                    {loading && filteredNotifications.length > 0 && (
                      <div className="p-4 text-center">
                        <Spinner size="sm" />
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
            onClick={() => {
              // Navigate to notifications page
              console.log("View all notifications");
              setIsOpen(false);
            }}
          >
            <span className="block py-2.5">Xem tất cả thông báo</span>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;

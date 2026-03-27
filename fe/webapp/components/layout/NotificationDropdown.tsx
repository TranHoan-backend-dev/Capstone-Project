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
  Spinner,
} from "@heroui/react";
import {
  BellIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "@/context/NotificationContext";
import { Notification } from "@/services/notification.service";

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    isConnected,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 10 &&
      !isLoadingMore &&
      filter === "all"
    ) {
      setIsLoadingMore(true);
      // Có thể thêm logic load more notifications nếu cần
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 800);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "sign-request":
        return "bg-purple-600";
      case "system":
        return "bg-blue-600";
      case "billing":
        return "bg-green-600";
      case "message":
      default:
        return "bg-orange-600";
    }
  };

  const getNotificationTypeLabel = (type: Notification["type"]) => {
    switch (type) {
      case "sign-request":
        return "Yêu cầu ký";
      case "system":
        return "Hệ thống";
      case "billing":
        return "Thanh toán";
      case "message":
      default:
        return "Tin nhắn";
    }
  };

  if (loading) {
    return (
      <Button
        isIconOnly
        className="relative text-default-600 hover:bg-default-100"
        radius="full"
        variant="light"
        disabled
      >
        <Badge
          className="border-2 border-background"
          color="danger"
          content="..."
          shape="circle"
          size="sm"
        >
          <BellIcon className="w-6 h-6 text-default-600" />
        </Badge>
      </Button>
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
            content={unreadCount > 0 ? unreadCount : null}
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
                <Button
                  isIconOnly
                  className="hover:bg-default-100"
                  radius="full"
                  size="sm"
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (unreadCount > 0) {
                      markAllAsRead();
                    }
                  }}
                >
                  <EllipsisHorizontalIcon className="w-6 h-6 text-default-600" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  className={`font-bold px-4 text-sm ${filter === "all" ? "bg-primary-50 text-primary" : "bg-transparent text-default-600 hover:bg-default-100"}`}
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
                  className={`font-bold px-4 text-sm ${filter === "unread" ? "bg-primary-50 text-primary" : "bg-transparent text-default-600 hover:bg-default-100"}`}
                  radius="full"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter("unread");
                  }}
                >
                  Chưa đọc ({unreadCount})
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
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-3 py-3 transition-all rounded-xl relative group hover:bg-default-50 mb-1 ${!n.isRead ? "bg-default-100" : ""}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.classList.add("bg-default-100");
                      }}
                      onMouseLeave={(e) => {
                        if (n.isRead) {
                          e.currentTarget.classList.remove("bg-default-100");
                        }
                      }}
                      onClick={() => {
                        if (!n.isRead) {
                          markAsRead(n.id);
                        }
                      }}
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
                          className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-background ${getNotificationIcon(n.type)}`}
                        >
                          {n.type === "message" ? (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          ) : (
                            <CheckCircleIcon className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-baseline gap-2 mb-1">
                          <p
                            className={`text-[14px] leading-[1.3] ${!n.isRead ? "font-bold text-foreground" : "text-default-600 font-medium"}`}
                          >
                            <span className="text-foreground font-bold">
                              {n.sender}
                            </span>
                          </p>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                            {getNotificationTypeLabel(n.type)}
                          </span>
                        </div>
                        <p
                          className={`text-[13px] leading-[1.4] ${!n.isRead ? "text-foreground" : "text-default-500"}`}
                        >
                          {n.message}
                        </p>
                        <p
                          className={`text-[12px] mt-1.5 ${!n.isRead ? "text-primary font-bold" : "text-default-400 font-medium"}`}
                        >
                          {n.time}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        size="sm"
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id);
                        }}
                      >
                        <TrashIcon className="w-4 h-4 text-danger" />
                      </Button>
                      {!n.isRead && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-default-400 px-4">
                    <BellIcon className="w-12 h-12 mx-auto opacity-20 mb-3" />
                    <p className="font-bold text-default-500">
                      Không có thông báo mới
                    </p>
                    <p className="text-sm">
                      {filter === "unread"
                        ? "Bạn đã đọc tất cả thông báo!"
                        : "Khi có bình luận hoặc tin nhắn, bạn sẽ thấy ở đây."}
                    </p>
                  </div>
                )}
                {isLoadingMore && (
                  <div className="p-6 text-center">
                    <Spinner size="sm" color="primary" />
                  </div>
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
            <span className="block py-2.5">Xem tất cả</span>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;

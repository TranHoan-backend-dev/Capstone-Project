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

import { CallToast } from "../ui/CallToast";

import { useWebSocket } from "@/context/WebSocketContext";
import { useProfile } from "@/hooks/useLogin";
import CustomButton from "../ui/custom/CustomButton";

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
// Component riêng cho message có thể mở rộng - Đặt OUTSIDE component NotificationDropdown
const NotificationMessage = ({
  notification,
}: {
  notification: Notification;
}) => {
  const [expanded, setExpanded] = useState(false);
  const normalizedTitle = (notification.title || "Thông báo mới").trim();
  const normalizedMessage = (notification.message || "").trim();
  const fallbackMessage = "Bạn có một thông báo mới.";
  const messageToDisplay = normalizedMessage || fallbackMessage;
  const rawParts = messageToDisplay
    .split(" - ")
    .map((part) => part.trim())
    .filter(Boolean);
  const lines =
    rawParts.length > 0
      ? rawParts.map((part, idx) => (idx === 0 ? part : `- ${part}`))
      : [fallbackMessage];
  const MAX_LINES = 3;
  const displayedLines = expanded ? lines : lines.slice(0, MAX_LINES);
  const canExpand = lines.length > MAX_LINES;

  return (
    <div className="min-w-0">
      <p
        className={`text-[14px] leading-[1.35] line-clamp-1 ${
          !notification.isRead
            ? "font-semibold text-foreground"
            : "font-medium text-foreground"
        }`}
      >
        {normalizedTitle}
      </p>
      <div className="text-[13px] leading-[1.45] text-default-600 space-y-0.5">
        {displayedLines.map((line, idx) => (
          <p key={`${notification.id}-line-${idx}`} className="break-words">
            {line}
          </p>
        ))}
      </div>
      {canExpand && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          className="text-primary text-[12px] mt-1 font-medium hover:underline p-0 h-auto min-w-0 bg-transparent"
        >
          {expanded ? "Thu gọn" : "Xem chi tiết"}
        </button>
      )}
    </div>
  );
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
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

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

  const { profile } = useProfile();
  // Fetch total unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/unread-count");
      if (response.ok) {
        const data = await response.json();
        setTotalUnreadCount(data.data || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

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

  // Xử lý thông báo mới từ WebSocket
  const handleNewNotification = useCallback(
    (newPayload: any) => {
      console.log("🔔 New notification received payload:", newPayload);

      // Backend sends NotificationResponse directly or wrapped
      const newNotification = newPayload.notificationId
        ? newPayload
        : newPayload.data;
      if (!newNotification) return;

      const transformed = transformNotification(newNotification);

      // Show Toast - đưa tiêu đề vào cả title và description để đảm bảo hiển thị trên mọi phiên bản HeroUI
      CallToast({
        title: "",
        message: transformed.title, // Dùng title làm description luôn nếu message yêu cầu trống
        color: "primary",
      });

      // Thêm vào danh sách notifications trước khi fetch để update UI tức thì
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === transformed.id);
        if (exists) return prev;
        const newList = [transformed, ...prev];
        // Giới hạn số lượng hiển thị trong dropdown (ví dụ 10-20 cái)
        return newList.slice(0, 20);
      });

      // Cập nhật số lượng tổng cộng và danh sách ngay lập tức
      fetchUnreadCount();
      fetchNotifications(1, false);

      // Cập nhật allNotifications nếu modal đang mở
      if (isModalOpen) {
        setAllNotifications((prev) => {
          const exists = prev.some((n) => n.id === transformed.id);
          if (exists) return prev;
          return [transformed, ...prev];
        });
      }

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
    },
    [isModalOpen, fetchUnreadCount],
  );

  // Cập nhật Badge trên tab trình duyệt khi có thông báo chưa đọc
  useEffect(() => {
    if (document.visibilityState === "hidden" && totalUnreadCount > 0) {
      const baseTitle = document.title.replace(/^🔔 \(\d+\) /, "");
      document.title = `🔔 (${totalUnreadCount}) ${baseTitle}`;
    } else if (document.visibilityState === "visible") {
      document.title = document.title.replace(/^🔔 \(\d+\) /, "");
    }
  }, [totalUnreadCount]);

  // Subscribe WebSocket topics
  useEffect(() => {
    if (!profile?.id || !profile?.role || !isConnected) return;

    const handleNotification = (notification: any) => {
      handleNewNotification(notification);
    };

    const userId = profile.id;
    const role = profile.role.toUpperCase();
    const topics: string[] = ["/notification", "/topic/notifications"];

    // Role-based topics (matching backend Topic.java)
    if (role === "PLANNING_TECHNICAL_DEPARTMENT_HEAD") {
      topics.push("/technical", "/technical/head", "/create-new-order");
    } else if (role === "SURVEY_STAFF") {
      topics.push(
        "/technical",
        "/technical/survey-staff",
        `/technical/survey-staff/${userId}`,
      );
    } else if (role === "ORDER_RECEIVING_STAFF") {
      topics.push("/technical", "/technical/order-receiving-staff");
    } else if (role === "CONSTRUCTION_DEPARTMENT_HEAD") {
      topics.push("/construction", "/construction/head");
    } else if (role === "CONSTRUCTION_DEPARTMENT_STAFF") {
      topics.push("/construction", "/construction/staff");
    } else if (role === "BUSINESS_DEPARTMENT_HEAD") {
      topics.push("/business", "/business/head");
    } else if (role === "METER_INSPECTION_STAFF") {
      topics.push("/business", "/business/staff");
    } else if (role === "IT_STAFF") {
      topics.push("/it");
    } else if (role === "FINANCE_DEPARTMENT") {
      topics.push("/finance");
    } else if (role === "COMPANY_LEADERSHIP") {
      topics.push("/leadership");
    }

    // Unique topics
    const uniqueTopics = Array.from(new Set(topics));

    console.log("🔔 Subscribing to topics:", uniqueTopics);
    uniqueTopics.forEach((topic) => {
      subscribe(topic, handleNotification);
    });

    return () => {
      uniqueTopics.forEach((topic) => {
        unsubscribe(topic, handleNotification);
      });
    };
  }, [
    subscribe,
    unsubscribe,
    handleNewNotification,
    profile?.id,
    profile?.role,
    isConnected,
  ]);

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
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `/api/notifications/${notificationId}/read`,
          {
            method: "PATCH",
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
          fetchUnreadCount();
        }
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    },
    [fetchUnreadCount],
  );

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
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, [fetchUnreadCount]);

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
          fetchUnreadCount();
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [fetchUnreadCount],
  );

  // Initial data load - Chỉ gọi khi người dùng truy cập web
  useEffect(() => {
    if (isConnected) {
      fetchNotifications(1, false);
      fetchUnreadCount();
    }
  }, [isConnected, fetchNotifications, fetchUnreadCount]);

  // Khi dropdown mở, không gọi API nữa (sử dụng cache trong state)
  // Trừ khi danh sách đang trống do lỗi trước đó
  useEffect(() => {
    if (isOpen && notifications.length === 0 && !hasError) {
      fetchNotifications(1, false);
      fetchUnreadCount();
    }
  }, [
    isOpen,
    notifications.length,
    hasError,
    fetchNotifications,
    fetchUnreadCount,
  ]);

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
              <NotificationMessage notification={n} />
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
              <NotificationMessage notification={n} />
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
                totalUnreadCount === 0 ? "hidden" : "border-2 border-background"
              }
              color="danger"
              content={totalUnreadCount >= 99 ? "99+" : totalUnreadCount}
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
          closeOnSelect={false}
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
                    {totalUnreadCount > 0 && (
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
    </>
  );
};

export default NotificationDropdown;

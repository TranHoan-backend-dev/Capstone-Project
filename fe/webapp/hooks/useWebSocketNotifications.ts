// hooks/useWebSocketNotifications.ts
import { useEffect, useRef, useState, useCallback } from "react";

import { websocketService } from "@/services/websocket.service";
import { getClientAccessToken } from "@/utils/getClientAccessToken";

interface UserInfo {
  id: string;
  roles: string[];
  email?: string;
  name?: string;
}

export const useWebSocketNotifications = (
  onNotificationReceived: (notification: any) => void,
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const subscribedTopics = useRef<string[]>([]); // Thay đổi từ Set thành Array
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Get user from token
  const getUserFromToken = useCallback((token: string): UserInfo | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub || payload.userId,
        roles: payload.realm_access?.roles || payload.roles || [],
        email: payload.email,
        name: payload.name,
      };
    } catch (error) {
      console.error("[WebSocket] Failed to decode token:", error);
      return null;
    }
  }, []);

  // Get topics based on user roles
  const getUserTopics = useCallback((user: UserInfo): string[] => {
    const topics: string[] = [];
    const userId = user?.id;
    const roles = user?.roles?.map((r) => r.toUpperCase()) || [];

    if (!userId) return topics;

    // Default general notification topic
    topics.push("/notification");

    // Case-by-case mapping based on what backend Topic.java and consumers use
    if (roles.includes("PLANNING_TECHNICAL_DEPARTMENT_HEAD")) {
      topics.push("/technical");
      topics.push("/technical/head");
      topics.push("/create-new-order");
    }

    if (roles.includes("SURVEY_STAFF")) {
      topics.push("/technical");
      topics.push("/technical/survey-staff");
      topics.push(`/technical/survey-staff/${userId}`);
    }

    if (roles.includes("ORDER_RECEIVING_STAFF")) {
      topics.push("/technical");
      topics.push("/technical/order-receiving-staff");
    }

    if (roles.includes("CONSTRUCTION_DEPARTMENT_HEAD")) {
      topics.push("/construction");
      topics.push("/construction/head");
    }

    if (roles.includes("CONSTRUCTION_DEPARTMENT_STAFF")) {
      topics.push("/construction");
      topics.push("/construction/staff");
    }

    if (roles.includes("BUSINESS_DEPARTMENT_HEAD")) {
      topics.push("/business");
      topics.push("/business/head");
    }

    if (roles.includes("METER_INSPECTION_STAFF")) {
      topics.push("/business");
      topics.push("/business/staff");
    }

    if (roles.includes("IT_STAFF")) {
      topics.push("/it");
    }

    if (roles.includes("FINANCE_DEPARTMENT")) {
      topics.push("/finance");
    }

    if (roles.includes("COMPANY_LEADERSHIP")) {
      topics.push("/leadership");
    }

    // Always follow common topics although backend doesn't explicitly state them for all roles
    // But NotificationController.java uses Topic.getTopic(department) which can be /notification
    topics.push("/topic/notifications");

    // Remove duplicates using Set and filters
    return [...new Set(topics)];
  }, []);

  // Connect to WebSocket
  const connectWebSocket = useCallback(async (accessToken: string) => {
    try {
      console.log("[WebSocket] Connecting...");
      await websocketService.connect(accessToken);
      console.log("[WebSocket] Connected successfully");
      setIsConnected(true);
      setConnectionError(null);
      return true;
    } catch (error) {
      console.error("[WebSocket] Connection failed:", error);
      setConnectionError(
        error instanceof Error ? error.message : "Connection failed",
      );
      setIsConnected(false);
      return false;
    }
  }, []);

  // Subscribe to topics
  const subscribeToTopics = useCallback(
    (user: UserInfo) => {
      const topics = getUserTopics(user);
      console.log("[WebSocket] Subscribing to topics:", topics);

      topics.forEach((topic) => {
        // Kiểm tra nếu topic chưa được subscribe
        if (!subscribedTopics.current.includes(topic)) {
          websocketService.subscribe(topic, (notification) => {
            console.log(`[WebSocket] Received on ${topic}:`, notification);
            onNotificationReceived(notification);
          });
          subscribedTopics.current.push(topic);
        }
      });
    },
    [getUserTopics, onNotificationReceived],
  );

  // Get access token
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    // Method 1: Get from localStorage
    const token = localStorage.getItem("access_token");
    if (token) return token;

    // Method 2: Get from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const cookieToken = getCookie("access_token");
    if (cookieToken) return cookieToken;

    // Method 3: Call your auth endpoint
    try {
      const response = await fetch("/api/auth/token");
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error("[WebSocket] Failed to get access token:", error);
      return null;
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initWebSocket = async () => {
      try {
        const accessToken = await getClientAccessToken();
        if (!accessToken) {
          console.error("[WebSocket] No access token available");
          if (mounted) {
            setConnectionError("No authentication token available");
          }
          return;
        }

        const user = getUserFromToken(accessToken);
        if (!user || !user.id) {
          console.error("[WebSocket] Invalid user data from token");
          if (mounted) {
            setConnectionError("Invalid user token");
          }
          return;
        }

        const connected = await connectWebSocket(accessToken);

        if (connected && mounted) {
          subscribeToTopics(user);
          retryCount = 0; // Reset retry count on successful connection
        } else if (mounted && retryCount < maxRetries) {
          // Retry connection
          retryCount++;
          const delay = 5000 * retryCount;
          console.log(
            `[WebSocket] Retrying connection in ${delay}ms (attempt ${retryCount}/${maxRetries})`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              initWebSocket();
            }
          }, delay);
        }
      } catch (error) {
        console.error("[WebSocket] Initialization error:", error);
        if (mounted) {
          setConnectionError(
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      }
    };

    initWebSocket();

    // Cleanup
    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      websocketService.disconnect();
      setIsConnected(false);
      subscribedTopics.current = []; // Clear array instead of Set
    };
  }, [getAccessToken, getUserFromToken, connectWebSocket, subscribeToTopics]);

  // Manual reconnect function
  const reconnect = useCallback(async () => {
    console.log("[WebSocket] Manual reconnect requested");
    setConnectionError(null);
    websocketService.disconnect();
    subscribedTopics.current = []; // Clear array

    const accessToken = await getAccessToken();
    if (accessToken) {
      const user = getUserFromToken(accessToken);
      if (user) {
        const connected = await connectWebSocket(accessToken);
        if (connected) {
          subscribeToTopics(user);
        }
      }
    }
  }, [getAccessToken, getUserFromToken, connectWebSocket, subscribeToTopics]);

  return {
    isConnected,
    connectionError,
    reconnect,
  };
};

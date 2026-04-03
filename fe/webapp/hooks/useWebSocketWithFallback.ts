// hooks/useWebSocketWithFallback.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { useWebSocketNotifications } from "./useWebSocketNotifications";

export const useWebSocketWithFallback = (
  onNotificationReceived: (notification: any) => void,
  pollingIntervalMs: number = 5000,
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isUsingPolling, setIsUsingPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const lastNotificationIdRef = useRef<string>();

  // WebSocket connection
  const { isConnected: wsConnected } = useWebSocketNotifications(
    onNotificationReceived,
  );

  // Polling function
  const pollNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications?page=1&size=5");
      if (response.ok) {
        const data = await response.json();
        const notifications = data.content || data.data || [];

        // Check for new notifications
        if (notifications.length > 0) {
          const latestNotification = notifications[0];
          if (latestNotification.id !== lastNotificationIdRef.current) {
            // New notification found
            onNotificationReceived(latestNotification);
            lastNotificationIdRef.current = latestNotification.id;
          }
        }
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  }, [onNotificationReceived]);

  // Start/Stop polling based on WebSocket status
  useEffect(() => {
    if (wsConnected) {
      console.log("✅ WebSocket connected, stopping polling");
      setIsConnected(true);
      setIsUsingPolling(false);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = undefined;
      }
    } else {
      console.log("❌ WebSocket disconnected, starting polling fallback");
      setIsConnected(false);
      setIsUsingPolling(true);

      // Start polling if not already running
      if (!pollingIntervalRef.current) {
        pollNotifications(); // Poll immediately
        pollingIntervalRef.current = setInterval(
          pollNotifications,
          pollingIntervalMs,
        );
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = undefined;
      }
    };
  }, [wsConnected, pollNotifications, pollingIntervalMs]);

  return { isConnected, isUsingPolling };
};

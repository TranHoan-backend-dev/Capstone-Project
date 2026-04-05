// components/GlobalWebSocket.tsx
"use client";

import { useEffect } from "react";
import { useWebSocketNotifications } from "@/hooks/useWebSocketNotifications";

export default function GlobalWebSocket() {
  const handleNotification = (notification: any) => {
    console.log("Global notification received:", notification);
    // Xử lý notification global ở đây
    // Có thể dispatch event hoặc update global state
  };

  const { isConnected, connectionError, reconnect } =
    useWebSocketNotifications(handleNotification);

  useEffect(() => {
    if (connectionError) {
      console.error("Global WebSocket error:", connectionError);
    }
  }, [connectionError]);

  // Không render gì cả, chỉ để khởi tạo WebSocket
  return null;
}

// contexts/WebSocketContext.tsx
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { websocketService } from "@/services/websocket.service";
import { getClientAccessToken } from "@/utils/getClientAccessToken";

interface WebSocketContextType {
  isConnected: boolean;
  connectionError: string | null;
  reconnect: () => void;
  lastNotification: any | null;
  subscribe: (topic: string, callback: (data: any) => void) => void;
  unsubscribe: (topic: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<any | null>(null);
  const callbacksRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  // Xử lý notification từ WebSocket
  const handleNotification = (topic: string, data: any) => {
    setLastNotification(data);
    // Gọi tất cả callbacks đã đăng ký cho topic này
    const callbacks = callbacksRef.current.get(topic);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  };

  // Subscribe wrapper
  const subscribe = (topic: string, callback: (data: any) => void) => {
    // Lưu callback vào ref
    if (!callbacksRef.current.has(topic)) {
      callbacksRef.current.set(topic, new Set());
      // Đăng ký topic với WebSocket service
      websocketService.subscribe(topic, (data) =>
        handleNotification(topic, data),
      );
    }
    callbacksRef.current.get(topic)?.add(callback);
  };

  // Unsubscribe wrapper
  const unsubscribe = (topic: string, callback?: (data: any) => void) => {
    if (callback) {
      callbacksRef.current.get(topic)?.delete(callback);
      if (callbacksRef.current.get(topic)?.size === 0) {
        websocketService.unsubscribe(topic);
        callbacksRef.current.delete(topic);
      }
    } else {
      websocketService.unsubscribe(topic);
      callbacksRef.current.delete(topic);
    }
  };

  // Khởi tạo WebSocket connection
  useEffect(() => {
    let mounted = true;

    const initWebSocket = async () => {
      try {
        const token = await getClientAccessToken();
        if (!token) {
          setConnectionError("No authentication token");
          return;
        }

        await websocketService.connect(token);
        if (mounted) {
          setIsConnected(true);
          setConnectionError(null);
        }
      } catch (error) {
        console.error("WebSocket connection error:", error);
        if (mounted) {
          setConnectionError(
            error instanceof Error ? error.message : "Connection failed",
          );
          setIsConnected(false);
        }
      }
    };

    initWebSocket();

    // Check connection status periodically
    const interval = setInterval(() => {
      if (mounted) {
        const connected = websocketService.isConnected();
        setIsConnected(connected);
        if (!connected && !connectionError) {
          setConnectionError("Connection lost");
        }
      }
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
      // Không disconnect ở đây vì cần giữ connection cho toàn app
    };
  }, []);

  const reconnect = async () => {
    setConnectionError(null);
    websocketService.disconnect();
    const token = await getClientAccessToken();
    if (token) {
      await websocketService.connect(token);
      setIsConnected(websocketService.isConnected());
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connectionError,
        reconnect,
        lastNotification,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within WebSocketProvider");
  return context;
};

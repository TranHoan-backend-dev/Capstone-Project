// services/websocket.service.ts
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect(accessToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        console.log("[WebSocket] Already connecting, skipping...");
        reject(new Error("Already connecting"));
        return;
      }

      if (this.client?.connected) {
        console.log("[WebSocket] Already connected");
        resolve();
        return;
      }

      this.isConnecting = true;

      // Dùng raw WebSocket thay vì SockJS
      let wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/n/ws";

      // Chuyển đổi protocol đúng
      if (wsUrl.startsWith("http://")) {
        wsUrl = wsUrl.replace("http://", "ws://");
      } else if (wsUrl.startsWith("https://")) {
        wsUrl = wsUrl.replace("https://", "wss://");
      }

      console.log("[WebSocket] Connecting to:", wsUrl);

      this.client = new Client({
        brokerURL: wsUrl, // Dùng raw WebSocket URL
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        debug: (str) => {
          if (process.env.NODE_ENV === "development") {
            console.log("[WebSocket Debug]", str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {
          console.log("[WebSocket] Connected successfully");
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          resolve();
        },

        onStompError: (frame) => {
          console.error("[WebSocket] STOMP error:", frame);
          this.isConnecting = false;
          reject(new Error(frame.headers?.message || "STOMP error"));
        },

        onWebSocketError: (event) => {
          console.error("[WebSocket] WebSocket error:", event);
          this.isConnecting = false;
          if (this.reconnectAttempts === 0) {
            reject(event);
          }
        },

        onDisconnect: () => {
          console.log("[WebSocket] Disconnected");
          this.isConnecting = false;
        },
      });

      this.client.activate();
    });
  }

  subscribe(topic: string, callback: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
      console.warn(`[WebSocket] Not connected, cannot subscribe to ${topic}`);
      // Store callback for retry when connected
      this.waitForConnection(() => {
        this.subscribe(topic, callback);
      });
      return;
    }

    // Check if already subscribed
    if (this.subscriptions.has(topic)) {
      console.log(`[WebSocket] Already subscribed to ${topic}`);
      return;
    }

    try {
      const subscription = this.client.subscribe(topic, (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error("[WebSocket] Parse error for topic", topic, ":", error);
          callback(message.body);
        }
      });

      this.subscriptions.set(topic, subscription);
      console.log(`[WebSocket] Subscribed to ${topic}`);
    } catch (error) {
      console.error(`[WebSocket] Failed to subscribe to ${topic}:`, error);
    }
  }

  private waitForConnection(callback: () => void): void {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    const interval = setInterval(() => {
      attempts++;
      if (this.client?.connected) {
        clearInterval(interval);
        callback();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error("[WebSocket] Timeout waiting for connection");
      }
    }, 100);
  }

  unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`[WebSocket] Unsubscribed from ${topic}`);
    }
  }

  disconnect(): void {
    console.log("[WebSocket] Disconnecting...");
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.subscriptions.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch (error) {
        console.error("[WebSocket] Error unsubscribing:", error);
      }
    });
    this.subscriptions.clear();

    if (this.client) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.error("[WebSocket] Error during disconnect:", error);
      }
      this.client = null;
    }
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const websocketService = new WebSocketService();

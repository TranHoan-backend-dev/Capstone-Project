// services/websocket.service.ts
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(accessToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const socketUrl =
        process.env.NEXT_PUBLIC_WS_URL || "http://localhost:9007/ws";

      this.client = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        debug: (str) => console.log("[WebSocket]", str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("[WebSocket] Connected");
          this.reconnectAttempts = 0;
          resolve();
        },
        onStompError: (frame) => {
          console.error("[WebSocket] STOMP error:", frame);
          reject(frame);
        },
        onWebSocketError: (event) => {
          console.error("[WebSocket] Error:", event);
          this.handleReconnect(accessToken);
        },
      });

      this.client.activate();
    });
  }

  private handleReconnect(accessToken: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `[WebSocket] Reconnecting attempt ${this.reconnectAttempts}`,
        );
        this.connect(accessToken);
      }, 5000 * this.reconnectAttempts);
    }
  }

  subscribe(topic: string, callback: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
      console.warn(`[WebSocket] Not connected, cannot subscribe to ${topic}`);
      return;
    }

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("[WebSocket] Parse error:", error);
      }
    });

    this.subscriptions.set(topic, subscription);
    console.log(`[WebSocket] Subscribed to ${topic}`);
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
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }
}

export const websocketService = new WebSocketService();

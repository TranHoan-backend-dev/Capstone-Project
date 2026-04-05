import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private isConnecting = false;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: ((error?: any) => void) | null = null;

  private pendingSubscriptions: Array<{ topic: string; callback: (message: any) => void }> = [];

  setCallbacks(onConnect: () => void, onDisconnect: (error?: any) => void) {
    this.onConnectCallback = onConnect;
    this.onDisconnectCallback = onDisconnect;
  }

  connect(accessToken: string): Promise<void> {
    if (this.client?.active) {
      console.log("[WebSocket] Already active, skipping connect");
      return Promise.resolve();
    }

    if (this.isConnecting) {
      console.log("[WebSocket] Connection attempt in progress...");
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      let baseUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000/n/ws";

      console.log("[WebSocket] Connecting to:", baseUrl);

      this.client = new Client({
        webSocketFactory: () => new SockJS(baseUrl),
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        debug: (str) => {
          if (process.env.NODE_ENV === "development") {
            // console.log("[WebSocket]", str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {
          console.log("[WebSocket] Connected successfully");
          this.isConnecting = false;
          this.onConnectCallback?.();
          this.processPendingSubscriptions();
          resolve();
        },

        onStompError: (frame) => {
          console.error("[WebSocket] STOMP error:", frame.headers["message"]);
          this.isConnecting = false;
          const error = frame.headers["message"] || "STOMP error";
          this.onDisconnectCallback?.(error);
          reject(new Error(error));
        },

        onWebSocketError: (event) => {
          console.error("[WebSocket] WebSocket error occurred");
          this.isConnecting = false;
          this.onDisconnectCallback?.("WebSocket error");
          // Chỉ reject lần đầu tiên để tránh unhandled promise rejections khi tự động reconnect
          if (this.client?.active === false) {
             reject(new Error("WebSocket connection failed"));
          }
        },

        onDisconnect: () => {
          console.log("[WebSocket] Disconnected");
          this.isConnecting = false;
          this.onDisconnectCallback?.();
        },
      });

      try {
        this.client.activate();
      } catch (err) {
        this.isConnecting = false;
        reject(err);
      }
    });
  }

  private processPendingSubscriptions() {
    if (!this.client || !this.client.connected) return;
    
    console.log(`[WebSocket] Processing ${this.pendingSubscriptions.length} pending subscriptions`);
    const toSubscribe = [...this.pendingSubscriptions];
    this.pendingSubscriptions = [];
    
    toSubscribe.forEach(({ topic, callback }) => {
      this.subscribe(topic, callback);
    });
  }

  subscribe(topic: string, callback: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
      // Check if already pending to avoid duplicates
      if (!this.pendingSubscriptions.find(s => s.topic === topic)) {
        console.log(`[WebSocket] Queueing subscription for ${topic} (not connected yet)`);
        this.pendingSubscriptions.push({ topic, callback });
      }
      return;
    }

    // Check if already subscribed
    if (this.subscriptions.has(topic)) {
      // console.log(`[WebSocket] Already subscribed to ${topic}`);
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

  unsubscribe(topic: string): void {
    // Remove from pending if it's there
    const pendingIndex = this.pendingSubscriptions.findIndex(s => s.topic === topic);
    if (pendingIndex !== -1) {
      this.pendingSubscriptions.splice(pendingIndex, 1);
      console.log(`[WebSocket] Removed ${topic} from pending subscriptions`);
    }

    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      try {
        subscription.unsubscribe();
        this.subscriptions.delete(topic);
        console.log(`[WebSocket] Unsubscribed from ${topic}`);
      } catch (error) {
        console.error(`[WebSocket] Error unsubscribing from ${topic}:`, error);
      }
    }
  }

  disconnect(): void {
    console.log("[WebSocket] Disconnecting manually...");
    
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
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const websocketService = new WebSocketService();

// services/websocket.service.ts (thay thế hoàn toàn)
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface WebSocketMessage {
  type: string;
  userId?: string;
  data: any;
  timestamp?: number;
}

class WebSocketService {
  private client: Client | null = null;
  private isConnectedFlag = false;
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private currentToken: string | null = null;
  private wsUrl: string;

  constructor() {
    // Sử dụng URL từ environment hoặc mặc định
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:9999";
    console.log("🔌 WebSocket STOMP Service initialized with URL:", this.wsUrl);
  }

  /**
   * Kết nối đến WebSocket server qua STOMP
   */
  public connect(accessToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!accessToken) {
          const error = "❌ No access token provided";
          console.error(error);
          reject(new Error(error));
          return;
        }

        this.currentToken = accessToken;

        // Tạo SockJS connection
        const socket = new SockJS(`${this.wsUrl}/ws`);

        this.client = new Client({
          webSocketFactory: () => socket as any,
          connectHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
          debug: (str) => {
            console.log("📡 STOMP debug:", str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
          console.log("✅ WebSocket STOMP connected successfully");
          this.isConnectedFlag = true;
          this.reconnectAttempts = 0;

          // Subscribe to notification topic
          this.subscribeToTopics();

          resolve();
        };

        this.client.onStompError = (frame) => {
          console.error("❌ STOMP error:", frame);
          reject(new Error(frame.headers["message"] || "STOMP error"));
        };

        this.client.onWebSocketError = (error) => {
          console.error("❌ WebSocket error:", error);
          reject(error);
        };

        this.client.onDisconnect = () => {
          console.log("⚠️ WebSocket disconnected");
          this.isConnectedFlag = false;

          if (
            this.reconnectAttempts < this.maxReconnectAttempts &&
            this.currentToken
          ) {
            this.reconnectAttempts++;
            const delay = 3000 * Math.pow(2, this.reconnectAttempts - 1);
            console.log(
              `🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
            );

            setTimeout(() => {
              this.connect(this.currentToken!).catch(console.error);
            }, delay);
          }
        };

        this.client.activate();
      } catch (error) {
        console.error("❌ WebSocket connection error:", error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe vào các topics
   */
  private subscribeToTopics(): void {
    if (!this.client || !this.isConnectedFlag) {
      console.warn("Cannot subscribe: not connected");
      return;
    }

    // Subscribe to user-specific notifications
    this.client.subscribe("/topic/notifications", (message: IMessage) => {
      try {
        const body = JSON.parse(message.body);
        console.log("📨 New notification received:", body);

        // Transform message to our format
        const webSocketMessage: WebSocketMessage = {
          type: body.type || "notification",
          data: body,
          timestamp: Date.now(),
        };

        this.handleMessage(webSocketMessage);
      } catch (error) {
        console.error("Failed to parse notification:", error);
      }
    });

    // Subscribe to user-specific queue if needed
    this.client.subscribe("/user/queue/notifications", (message: IMessage) => {
      try {
        const body = JSON.parse(message.body);
        console.log("📨 User-specific notification:", body);

        const webSocketMessage: WebSocketMessage = {
          type: body.type || "notification",
          data: body,
          timestamp: Date.now(),
        };

        this.handleMessage(webSocketMessage);
      } catch (error) {
        console.error("Failed to parse user notification:", error);
      }
    });
  }

  /**
   * Ngắt kết nối WebSocket
   */
  public disconnect(): void {
    this.isManualClose = true;
    this.currentToken = null;
    if (this.client && this.isConnectedFlag) {
      this.client.deactivate();
      this.client = null;
    }
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
    this.isConnectedFlag = false;
  }

  private isManualClose = false;

  /**
   * Gửi message tới server
   */
  public send(message: WebSocketMessage): void {
    if (!this.client || !this.isConnectedFlag) {
      console.warn("WebSocket not connected, message not sent:", message);
      return;
    }

    // Send to appropriate destination
    const destination = `/app/${message.type}`;
    this.client.publish({
      destination: destination,
      body: JSON.stringify(message.data),
    });
  }

  /**
   * Subscribe vào một loại message
   */
  public subscribe(
    messageType: string,
    handler: (data: any) => void,
  ): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    this.messageHandlers.get(messageType)!.add(handler);
    console.log(`📡 Subscribed to message type: ${messageType}`);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(messageType)?.delete(handler);
      console.log(`📡 Unsubscribed from message type: ${messageType}`);
    };
  }

  /**
   * Xử lý message nhận được
   */
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers && handlers.size > 0) {
      handlers.forEach((handler) => {
        try {
          handler(message.data);
        } catch (error) {
          console.error(
            `Error in message handler for type ${message.type}:`,
            error,
          );
        }
      });
    } else {
      // Handle generic notification
      const genericHandlers = this.messageHandlers.get("notification");
      if (genericHandlers) {
        genericHandlers.forEach((handler) => {
          try {
            handler(message.data);
          } catch (error) {
            console.error("Error in generic notification handler:", error);
          }
        });
      }
    }
  }

  /**
   * Kiểm tra kết nối
   */
  public isConnected(): boolean {
    return this.isConnectedFlag && this.client !== null;
  }
}

export const websocketService = new WebSocketService();

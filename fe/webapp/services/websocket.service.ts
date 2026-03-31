import { SOCKET_URL } from "@/utils/constraints";

export interface WebSocketMessage {
  type: string;
  userId?: string;
  data: any;
  timestamp?: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();
  private isManualClose = false;

  constructor() {
    // Convert HTTP URLs to WebSocket URLs
    let baseUrl = SOCKET_URL || "http://localhost:9999/ws";
    
    if (baseUrl.startsWith("http://")) {
      this.url = baseUrl.replace("http://", "ws://");
    } else if (baseUrl.startsWith("https://")) {
      this.url = baseUrl.replace("https://", "wss://");
    } else if (baseUrl.startsWith("ws://") || baseUrl.startsWith("wss://")) {
      this.url = baseUrl;
    } else {
      this.url = `ws://${baseUrl}`;
    }

    console.log("🔌 WebSocket Service initialized with URL:", this.url);
  }

  /**
   * Kết nối đến WebSocket server
   */
  public connect(accessToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!accessToken) {
          const error = "❌ No access token provided to WebSocket.connect()";
          console.error(error);
          reject(new Error(error));
          return;
        }

        // Thêm token vào URL
        const wsUrl = `${this.url}?token=${accessToken}`;
        console.log("🔗 Attempting to connect to WebSocket:", this.url);
        
        this.ws = new WebSocket(wsUrl);
        this.isManualClose = false;

        this.ws.onopen = () => {
          console.log("✅ WebSocket connected");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("⚠️  WebSocket disconnected");
          if (!this.isManualClose) {
            this.attemptReconnect(accessToken);
          }
        };
      } catch (error) {
        console.error("❌ WebSocket connection error:", error);
        reject(error);
      }
    });
  }

  /**
   * Ngắt kết nối WebSocket
   */
  public disconnect(): void {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Gửi message tới server
   */
  public send(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected");
      return;
    }
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Subscribe vào một loại message
   */
  public subscribe(messageType: string, handler: (data: any) => void): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    this.messageHandlers.get(messageType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(messageType)?.delete(handler);
    };
  }

  /**
   * Xử lý message nhận được
   */
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message.data);
        } catch (error) {
          console.error(`Error in message handler for type ${message.type}:`, error);
        }
      });
    }
  }

  /**
   * Tự động kết nối lại khi mất kết nối
   */
  private attemptReconnect(accessToken: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(accessToken).catch((error) => {
        console.error("Reconnection failed:", error);
      });
    }, delay);
  }

  /**
   * Kiểm tra kết nối
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();

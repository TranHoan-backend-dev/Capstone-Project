import { apiFetch } from './api';
import { CONFIG } from '../config';

export interface NotificationResponse {
  notificationId: string;
  title: string;
  link?: string;
  message: string;
  status: boolean; // false = unread, true = read
  createdAt: string;
}

export interface NotificationBatchResponse {
  notifications: NotificationResponse[];
  pageSize: number;
  totalNotifications: number;
}

class NotificationService {
  private socket: WebSocket | null = null;
  private onMessageCallback: ((notification: NotificationResponse) => void) | null = null;
  private readonly GENERAL_TOPIC = '/topic/notification';

  /**
   * Fetch paginated list of notifications for current user
   */
  async getNotifications(page: number = 0, size: number = 20): Promise<NotificationBatchResponse> {
    const response = await apiFetch(`/notification?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Initialize WebSocket connection and subscribe to the general notification topic
   */
  async connect(onMessage: (notification: NotificationResponse) => void) {
    this.onMessageCallback = onMessage;
    
    // Construct WebSocket URL
    const baseUrl = CONFIG.API_BASE_URL.replace('http', 'ws');
    const wsUrl = `${baseUrl}/ws/websocket`; 

    console.log(`[NotificationService] Connecting to ${wsUrl} for general notifications`);
    
    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[NotificationService] WebSocket connected');
        // STOMP CONNECT frame
        this.sendStompFrame('CONNECT', { 'accept-version': '1.2', host: 'vhost' });
      };

      this.socket.onmessage = (event) => {
        this.handleSocketMessage(event.data);
      };

      this.socket.onerror = (e) => {
        console.error('[NotificationService] WebSocket error:', e);
      };

      this.socket.onclose = (e) => {
        console.log('[NotificationService] WebSocket closed', e);
      };
    } catch (error) {
      console.error('[NotificationService] WebSocket connection failed:', error);
    }
  }

  private handleSocketMessage(data: string) {
    if (data.startsWith('CONNECTED')) {
      console.log(`[NotificationService] STOMP connected, subscribing to: ${this.GENERAL_TOPIC}`);
      this.sendStompFrame('SUBSCRIBE', { id: 'sub-0', destination: this.GENERAL_TOPIC });
    } else if (data.startsWith('MESSAGE')) {
      try {
        const bodyContent = data.split('\n\n')[1]?.replace(/\0/g, '');
        if (bodyContent && this.onMessageCallback) {
          const notification = JSON.parse(bodyContent);
          this.onMessageCallback(notification);
        }
      } catch (e) {
        console.warn('[NotificationService] Failed to parse message body', e);
      }
    }
  }

  private sendStompFrame(command: string, headers: Record<string, string>, body: string = '') {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    let frame = `${command}\n`;
    for (const [key, value] of Object.entries(headers)) {
      frame += `${key}:${value}\n`;
    }
    frame += `\n${body}\0`;
    this.socket.send(frame);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;

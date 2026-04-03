// hooks/useWebSocketNotifications.ts
import { useEffect, useRef, useState } from "react";
import { websocketService } from "@/services/websocket.service";
import { useAuth } from "./useAuth";
// hooks/useWebSocketNotifications.ts (updated)
export const useWebSocketNotifications = (
  onNotificationReceived: (notification: any) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const subscribedTopics = useRef<Set<string>>(new Set());

  useEffect(() => {
    const getAccessToken = () => {
      // Try multiple sources
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('access_token='));
      if (tokenCookie) {
        return tokenCookie.split('=')[1];
      }
      
      const localStorageToken = localStorage.getItem('access_token');
      if (localStorageToken) {
        return localStorageToken;
      }

      // Try to get from sessionStorage
      return sessionStorage.getItem('access_token');
    };

    const getUserFromToken = (token: string) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔑 Token payload:', payload);
        return {
          id: payload.sub || payload.userId,
          roles: payload.realm_access?.roles || payload.roles || [],
          email: payload.email,
          name: payload.name,
        };
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    };

    const accessToken = getAccessToken();
    console.log('🔑 Access token found:', !!accessToken);
    
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    const user = getUserFromToken(accessToken);
    console.log('👤 User from token:', user);
    
    if (!user) return;

    // Test WebSocket connection first
    const testWebSocket = async () => {
      try {
        console.log('🔌 Testing WebSocket connection...');
        await websocketService.connect(accessToken);
        console.log('✅ WebSocket test successful');
        setIsConnected(true);
        
        // Subscribe to topics
        const topicsToSubscribe = getUserTopics(user);
        console.log('📡 Subscribing to topics:', topicsToSubscribe);
        
        topicsToSubscribe.forEach(topic => {
          if (!subscribedTopics.current.has(topic)) {
            websocketService.subscribe(topic, (notification) => {
              console.log('📨 WebSocket message received on', topic, ':', notification);
              onNotificationReceived(notification);
            });
            subscribedTopics.current.add(topic);
          }
        });
      } catch (error) {
        console.error('❌ WebSocket connection failed:', error);
        setIsConnected(false);
      }
    };

    testWebSocket();

    return () => {
      websocketService.disconnect();
      setIsConnected(false);
      subscribedTopics.current.clear();
    };
  }, [onNotificationReceived]);

  return { isConnected };
};

// Helper để lấy topics dựa trên user roles
const getUserTopics = (user: any): string[] => {
  const topics: string[] = [];
  const userId = user?.id;

  if (!userId) return topics;

  // User-specific topic (để nhận thông báo cá nhân)
  topics.push(`/user/${userId}/queue/notifications`);

  // Role-based topics (từ backend logs thấy)
  if (user?.roles?.includes("SURVEY_STAFF")) {
    topics.push(`/topic/technical/survey-staff/${userId}`);
  }

  if (user?.roles?.includes("PLANNING_TECHNICAL_DEPARTMENT_HEAD")) {
    topics.push(`/topic/technical/head/${userId}`);
  }

  if (user?.roles?.includes("COMPANY_LEADERSHIP")) {
    topics.push(`/topic/leadership/${userId}`);
  }

  // General department topics (không có userId)
  if (user?.roles?.includes("SURVEY_STAFF")) {
    topics.push("/topic/technical/survey-staff");
  }

  if (user?.roles?.includes("PLANNING_TECHNICAL_DEPARTMENT_HEAD")) {
    topics.push("/topic/technical/head");
  }

  if (user?.roles?.includes("COMPANY_LEADERSHIP")) {
    topics.push("/topic/leadership");
  }

  return topics;
};

import { showToast } from '../utils/toast';
import { TokenManager } from './token';
import { CONFIG } from '../config';

const BASE_URL = CONFIG.API_BASE_URL;

// Global variables for single refresh promise management
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    console.log('hehe')
    const accessToken = await TokenManager.getAccessToken();

    const isFormData = options.body instanceof FormData;

    // Build initial headers (Authorization and Content-Type)
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...((options.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
      console.log(`[API Debug] Auth Header: Bearer ${accessToken.substring(0, 10)}...`);
    } else {
      console.log('[API Debug] NO Access Token found!');
    }

    console.log(`[API Request] ${options.method || 'GET'} ${BASE_URL}${endpoint}`);

    let response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token expiration (401)
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/refresh-token')) {
      console.log('[API] Access Token expired. Attempting refresh...');

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const refreshToken = await TokenManager.getRefreshToken();
            if (!refreshToken) return null;

            // Use correct endpoint mapping (likely /auth/auth/refresh-token based on context)
            const refreshResponse = await fetch(`${BASE_URL}/auth/auth/refresh-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              const tokenData = refreshData.data || refreshData;

              if (tokenData && tokenData.access_token) {
                console.log('[API] Token refresh successful.');
                await TokenManager.setTokens(tokenData.access_token, tokenData.refresh_token || refreshToken);
                return tokenData.access_token;
              }
            }
            return null;
          } catch (e: any) {
            console.error('[API] Error during token refresh:', e.message);
            return null;
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        })();
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        console.log('[API] Retrying original request with new token...');
        headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with new token
        response = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        // Refresh failed, clear session and throw error
        await TokenManager.logout();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    }

    if (!response.ok) {
      let errorMessage = `Lỗi hệ thống (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e: any) {
        console.error('[API] Parse error data failed:', e.message);
      }

      if (!endpoint.includes('/auth/login')) {
        showToast.error(errorMessage);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.message === 'Network request failed') {
      showToast.error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng (Wifi/4G).');
    } else if (error.message.includes('Phiên đăng nhập')) {
      // Skip toast if session expired error which already might show a message or redirect to login
    } else if (!error.message.includes('Lỗi') && !endpoint.includes('login')) {
      showToast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
    throw error;
  }
};

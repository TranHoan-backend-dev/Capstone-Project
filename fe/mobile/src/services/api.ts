import { showToast } from '../utils/toast';
import { TokenManager } from './token';
import { CONFIG } from '../config';

const BASE_URL = CONFIG.API_BASE_URL;

// Global variables for single refresh promise management
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let logoutHandler: (() => void) | null = null;

/**
 * Register a callback to be called when the session has expired and refresh fails.
 * This allows the AuthContext to reset its state.
 */
export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

export interface ApiOptions extends RequestInit {
  silent?: boolean;
}

export const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
  const { silent, ...fetchOptions } = options;
  try {
    console.log('hehe')
    const accessToken = await TokenManager.getAccessToken();

    const isFormData = fetchOptions.body instanceof FormData;

    // Build initial headers (Authorization and Content-Type)
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
      console.log(`[API Debug] Auth Header: Bearer ${accessToken.substring(0, 10)}...`);
    } else {
      console.log('[API Debug] NO Access Token found!');
    }

    console.log(`[API Request] ${fetchOptions.method || 'GET'} ${BASE_URL}${endpoint}`);

    let response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
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
          }
        })();
      }

      const newAccessToken = await refreshPromise;
      if (!isRefreshing) refreshPromise = null;

      if (newAccessToken) {
        console.log('[API] Retrying original request with new token...');
        headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(`${BASE_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
        });
      } else {
        // Refresh failed, clear session and force logout
        console.log('[API] Token refresh failed permanently. Logging out...');
        await TokenManager.logout();
        if (logoutHandler) logoutHandler();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    }

    if (!response.ok) {
      let errorMessage = `Lỗi hệ thống (${response.status})`;
      try {
        const text = await response.text();
        if (text) {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch (e: any) {
        console.warn('[API] Parse error data failed or empty body:', e.message);
      }

      if (!silent) {
        showToast.error(errorMessage);
      }
      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error: any) {
    if (!silent) {
      if (error.message === 'Network request failed') {
        showToast.error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.');
      } else if (!error.message.includes('Phiên đăng nhập') && !error.message.includes('Lỗi')) {
        showToast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    }
    throw error;
  }
};

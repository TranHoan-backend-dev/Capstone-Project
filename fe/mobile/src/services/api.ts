import { showToast } from '../utils/toast';
import { TokenManager } from './token';
import { CONFIG } from '../config';

const BASE_URL = CONFIG.API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    console.log('hehe')
    const accessToken = await TokenManager.getAccessToken();

    const isFormData = options.body instanceof FormData;

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
    if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh-token') {
      console.log('[API] Access Token expired. Attempting refresh...');
      const refreshToken = await TokenManager.getRefreshToken();

      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const tokenData = refreshData.data || refreshData;

            if (tokenData && tokenData.access_token) {
              console.log('[API] Token refresh successful. Retrying request...');
              await TokenManager.setTokens(tokenData.access_token, tokenData.refresh_token || refreshToken);

              // Retry the original request with new token
              headers.Authorization = `Bearer ${tokenData.access_token}`;
              response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers,
              });
            }
          } else {
            console.log('[API] Token refresh failed with status:', refreshResponse.status);
          }
        } catch (refreshError) {
          console.error('[API] Error during token refresh:', refreshError);
        }
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

      // Don't show toast for some endpoints or if explicitly requested (could add an option for this)
      if (endpoint !== '/auth/login') {
        showToast.error(errorMessage);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.message === 'Network request failed') {
      showToast.error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng (Wifi/4G).');
    } else if (!error.message.includes('Lỗi') && !endpoint.includes('login')) {
      showToast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
    throw error;
  }
};

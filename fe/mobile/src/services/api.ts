import { showToast } from '../utils/toast';
import { TokenManager } from './token';
import { CONFIG } from '../config';

const BASE_URL = CONFIG.API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    console.log('hehe')
    const accessToken = await TokenManager.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log(`[API Request] ${options.method || 'GET'} ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Lỗi hệ thống (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e: any) {
        // Response không phải JSON
        console.error(e.message)
      }

      showToast.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.message === 'Network request failed') {
      showToast.error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng (Wifi/4G).');
    } else if (!error.message.includes('Lỗi')) {
      showToast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
    throw error;
  }
};

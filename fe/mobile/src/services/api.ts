import { showToast } from '../utils/toast';

const BASE_URL = 'http://localhost:9003/v1/api'; // Update this to your real API URL

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    console.log("Hehe")
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Lỗi ${response.status}: ${response.statusText}`;

      // Tự động hiển thị Toast lỗi cho tất cả các request thất bại
      showToast.error(errorMessage);

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    if (error.message === 'Network request failed') {
      showToast.error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.');
    } else if (!error.message.includes('Lỗi')) {
      //Trường hợp lỗi không mong muốn khác
      showToast.error('Có lỗi xảy ra trong quá trình xử lý');
    }
    throw error;
  }
};

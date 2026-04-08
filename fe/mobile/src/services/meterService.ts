import { apiFetch, ApiOptions } from './api';

export interface Usage {
  recordingDate: string;
  index: number;
  mass: number;
  price: number;
  meterImageUrl: string | null;
  isPaid: boolean;
  paymentMethod: string | null;
  status?: string;
}

export interface UsageHistoryResponse {
  serial: string;
  customerId: string;
  customerName: string;
  usagesList: Usage[];
}

export interface PendingReview {
  id: string; // ID của bản ghi tạm
  serial: string;
  customerId: string;
  customerName: string;
  address: string;
  oldIndex: number;
  newIndexAI: number; // Chỉ số do AI gợi ý
  imageUrl: string;
  // status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface MeterService {
  /**
   * Lấy danh sách các bản ghi cần phê duyệt (End of Day)
   * roadmapId: lọc theo lộ trình (nếu backend hỗ trợ query)
   */
  getPendingReviews: (
    options?: ApiOptions & { roadmapId?: string },
  ) => Promise<PendingReview[]>;

  /**
   * Xác nhận chỉ số sau khi đã kiểm tra (Phê duyệt hoặc sửa đổi)
   */
  confirmMeterReading: (
    reviewId: string,
    finalIndex: number,
    status: 'APPROVED' | 'REJECTED',
    options?: ApiOptions,
  ) => Promise<any>;

  /**
   * Cập nhật thủ công chỉ số theo serial (TC11)
   */
  updateUsageManual: (
    serial: string,
    date: string,
    index: number,
    options?: ApiOptions,
  ) => Promise<any>;

  /**
   * Lấy lịch sử sử dụng nước của khách hàng (bao gồm chỉ số cũ)
   */
  getUsageHistory: (
    customerId: string,
    options?: ApiOptions,
  ) => Promise<UsageHistoryResponse[]>;

  /**
   * Cập nhật chỉ số nước mới
   */
  updateMeterIndex: (
    serial: string,
    index: number,
    recordingDate: string,
    image: any,
    options?: ApiOptions,
  ) => Promise<any>;

  /**
   * Lấy chi tiết khách hàng (bao gồm mã đồng hồ, loại giá...)
   */
  getCustomerDetails: (
    customerId: string,
    options?: ApiOptions,
  ) => Promise<any>;

  /**
   * Lấy dữ liệu tiêu thụ gần nhất (3 tháng)
   */
  getRecentUsage: (
    customerId: string,
    options?: ApiOptions,
  ) => Promise<UsageHistoryResponse>;

  /**
   * Lấy URL hình ảnh đồng hồ mới nhất
   */
  getLatestImage: (customerId: string, options?: ApiOptions) => Promise<string>;

  /**
   * Phân tích ảnh chụp đồng hồ với AI (không cần mã serial)
   */
  analyzeMeterImage: (
    recordingDate: string,
    image: any,
    customerId?: string,
    options?: ApiOptions,
  ) => Promise<any>;

  /**
   * Phân tích ảnh chụp đồng hồ với AI (có mã serial)
   */
  analyzeMeterImageWithSerial: (
    serial: string,
    recordingDate: string,
    image: any,
    options?: ApiOptions,
  ) => Promise<any>;
}

export const meterService: MeterService = {
  // Trong meterService.ts
  // Trong meterService.ts
  getPendingReviews: async (options?: { roadmapId?: string }) => {
    const params = new URLSearchParams();
    if (options?.roadmapId) {
      params.append('roadmapId', options.roadmapId);
    }

    const queryString = params.toString();
    const url = `/d/usage/pending-reviews${
      queryString ? `?${queryString}` : ''
    }`;

    try {
      const response = await apiFetch(url);

      // Log để debug
      console.log('Pending reviews response:', response);

      // Lấy data từ response wrapper
      if (response && response.data) {
        const data = response.data;
        console.log('Extracted data:', data);
        console.log('Data length:', data?.length || 0);
        return Array.isArray(data) ? data : [];
      }

      // Fallback nếu response trực tiếp là mảng
      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error('Error in getPendingReviews:', error);
      throw error;
    }
  },

  confirmMeterReading: async (reviewId, finalIndex, status, options) => {
    return await apiFetch(`/d/usage/confirm/${reviewId}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options?.headers,
      },
      body: `finalIndex=${encodeURIComponent(
        String(finalIndex),
      )}&status=${encodeURIComponent(status)}`,
    });
  },

  updateUsageManual: async (serial, date, index, options) => {
    return await apiFetch(
      `/d/usage/${encodeURIComponent(serial)}?date=${encodeURIComponent(
        date,
      )}&index=${encodeURIComponent(String(index))}`,
      {
        ...options,
        method: 'PUT',
      },
    );
  },

  getRecentUsage: async (customerId, options) => {
    const response = await apiFetch(`/d/usage/recent/${customerId}`, options);
    return response.data;
  },

  getLatestImage: async (customerId, options) => {
    const response = await apiFetch(
      `/d/usage/latest-image/${customerId}`,
      options,
    );
    return response.data;
  },

  getUsageHistory: async (customerId, options) => {
    const response = await apiFetch(
      `/d/usage/batch?ids=${customerId}`,
      options,
    );
    return response.data;
  },

  analyzeMeterImage: async (recordingDate, image, customerId, options) => {
    const formData = new FormData();
    formData.append('recordingDate', recordingDate);
    if (customerId) {
      formData.append('customerId', customerId);
    }

    if (image) {
      const uri = typeof image === 'string' ? image : image.uri;
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'meter_reading.jpg',
      } as any);
    }

    const response = await apiFetch('/d/usage/analyze', {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options?.headers,
      },
    });
    return response.data;
  },

  analyzeMeterImageWithSerial: async (
    serial,
    recordingDate,
    image,
    options,
  ) => {
    const formData = new FormData();
    formData.append('recordingDate', recordingDate);

    if (image) {
      const uri = typeof image === 'string' ? image : image.uri;
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'meter_reading.jpg',
      } as any);
    }

    const response = await apiFetch(`/d/usage/analyze/${serial}`, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options?.headers,
      },
    });
    return response.data;
  },

  updateMeterIndex: async (serial, index, recordingDate, image, options) => {
    const formData = new FormData();
    formData.append('index', index.toString());
    formData.append('recordingDate', recordingDate);

    if (image) {
      const uri = typeof image === 'string' ? image : image.uri;
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'meter_reading.jpg',
      } as any);
    }

    return await apiFetch(`/d/usage/${serial}`, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options?.headers,
      },
    });
  },

  getCustomerDetails: async (customerId, options) => {
    const response = await apiFetch(
      `/customer/customers/${customerId}`,
      options,
    );
    return response.data;
  },
};

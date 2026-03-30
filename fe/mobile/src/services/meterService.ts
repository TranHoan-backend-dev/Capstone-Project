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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface MeterService {
  /**
   * Lấy danh sách các bản ghi cần phê duyệt (End of Day)
   */
  getPendingReviews: (options?: ApiOptions) => Promise<PendingReview[]>;

  /**
   * Xác nhận chỉ số sau khi đã kiểm tra (Phê duyệt hoặc sửa đổi)
   */
  confirmMeterReading: (reviewId: string, finalIndex: number, status: 'APPROVED' | 'REJECTED', options?: ApiOptions) => Promise<any>;

  /**
   * Lấy lịch sử sử dụng nước của khách hàng (bao gồm chỉ số cũ)
   */
  getUsageHistory: (customerId: string, options?: ApiOptions) => Promise<UsageHistoryResponse[]>;

  /**
   * Cập nhật chỉ số nước mới
   */
  updateMeterIndex: (serial: string, index: number, recordingDate: string, image: any, options?: ApiOptions) => Promise<any>;

  /**
   * Lấy chi tiết khách hàng (bao gồm mã đồng hồ, loại giá...)
   */
  getCustomerDetails: (customerId: string, options?: ApiOptions) => Promise<any>;

  /**
   * Lấy dữ liệu tiêu thụ gần nhất (3 tháng)
   */
  getRecentUsage: (customerId: string, options?: ApiOptions) => Promise<UsageHistoryResponse>;

  /**
   * Lấy URL hình ảnh đồng hồ mới nhất
   */
  getLatestImage: (customerId: string, options?: ApiOptions) => Promise<string>;
}

export const meterService: MeterService = {
  getPendingReviews: async (options) => {
    const response = await apiFetch('/d/usage/pending-reviews', options);
    return response.data;
  },

  confirmMeterReading: async (reviewId, finalIndex, status, options) => {
    return await apiFetch(`/d/usage/confirm/${reviewId}`, {
      ...options,
      method: 'POST',
      body: JSON.stringify({ finalIndex, status }),
    });
  },

  getRecentUsage: async (customerId, options) => {
    const response = await apiFetch(`/d/usage/recent/${customerId}`, options);
    return response.data;
  },

  getLatestImage: async (customerId, options) => {
    const response = await apiFetch(`/d/usage/latest-image/${customerId}`, options);
    return response.data;
  },

  getUsageHistory: async (customerId, options) => {
    const response = await apiFetch(`/d/usage/batch?ids=${customerId}`, options);
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
        ...options?.headers
      },
    });
  },

  getCustomerDetails: async (customerId, options) => {
    const response = await apiFetch(`/customer/customers/${customerId}`, options);
    return response.data;
  },
};

import { apiFetch } from './api';

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
  getPendingReviews: () => Promise<PendingReview[]>;

  /**
   * Xác nhận chỉ số sau khi đã kiểm tra (Phê duyệt hoặc sửa đổi)
   */
  confirmMeterReading: (reviewId: string, finalIndex: number, status: 'APPROVED' | 'REJECTED') => Promise<any>;

  /**
   * Lấy lịch sử sử dụng nước của khách hàng (bao gồm chỉ số cũ)

   */
  getUsageHistory: (customerId: string) => Promise<UsageHistoryResponse[]>;

  /**
   * Cập nhật chỉ số nước mới
   */
  updateMeterIndex: (serial: string, index: number, recordingDate: string, image: any) => Promise<any>;

  /**
   * Lấy chi tiết khách hàng (bao gồm mã đồng hồ, loại giá...)
   */
  getCustomerDetails: (customerId: string) => Promise<any>;
}

export const meterService: MeterService = {
  getPendingReviews: async () => {
    const response = await apiFetch('/d/usage/pending-reviews');
    return response.data;
  },

  confirmMeterReading: async (reviewId: string, finalIndex: number, status: 'APPROVED' | 'REJECTED') => {
    return await apiFetch(`/d/usage/confirm/${reviewId}`, {
      method: 'POST',
      body: JSON.stringify({ finalIndex, status }),
    });
  },

  getUsageHistory: async (customerId: string) => {

    const response = await apiFetch(`/d/usage/batch?ids=${customerId}`);
    return response.data;
  },

  updateMeterIndex: async (serial: string, index: number, recordingDate: string, image: any) => {
    // Nếu image là MultipartBody, chúng ta cần thay đổi Content-Type
    const formData = new FormData();
    formData.append('index', index.toString());
    formData.append('recordingDate', recordingDate);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'meter_reading.jpg',
      } as any);
    }

    return await apiFetch(`/d/usage/${serial}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getCustomerDetails: async (customerId: string) => {
    const response = await apiFetch(`/customer/customers/${customerId}`);
    return response.data;
  },
};

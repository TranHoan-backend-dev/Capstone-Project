import { apiFetch } from './api';

export interface MeterRoute {
  id: string;
  name: string;
  type?: string;
  totalCustomer: number;
  recorded: number;
  unrecorded: number;
  cutWater: number;
  m3: string;
  totalAmount: string;
}

export const roadmapService = {
  /**
   * Lấy danh sách tuyến ghi chỉ số (Roadmaps) cho nhân viên hiện tại
   * @param period Kỳ ghi (tháng)
   * @param year Năm
   * @param dot Đợt ghi
   */
  getMyRoadmaps: async (period: string, year: string, dot: string): Promise<MeterRoute[]> => {
    try {
      // Gọi API thực từ backend (Thông qua Gateway)
      // Path gợi ý: /customer/roadmaps/assigned cho service customer hoặc /construction/roadmaps/my-assigned
      const response = await apiFetch(`/customer/roadmaps/assigned?period=${period}&year=${year}&dot=${dot}`);
      
      // Giả sử backend trả về WrapperApiResponse<MeterRoute[]>
      return response.data || [];
    } catch (error) {
      console.error('[roadmapService] Failed to fetch roadmaps:', error);
      throw error;
    }
  }
};

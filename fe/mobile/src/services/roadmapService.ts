// import { apiFetch } from './api';

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
   * @param _period Kỳ ghi (tháng)
   * @param _year Năm
   * @param _dot Đợt ghi
   */
  getMyRoadmaps: async (_period: string, _year: string, _dot: string): Promise<MeterRoute[]> => {
    // Ghi chú: Hiện tại backend RoadmapController.java chưa có endpoint gán staffId và filter theo period/stats
    // Đây là code mẫu hướng tới việc gọi API thật sau khi backend cập nhật
    
    /*
    const response = await apiFetch(`/roadmaps/my-assigned?period=${_period}&year=${_year}&dot=${_dot}`);
    return response.data; // Giả định response.data trả về mảng MeterRoute
    */
    
    // Tạm thời trả về mảng rỗng hoặc xử lý mock trong service này nếu cần
    return [];
  }
};

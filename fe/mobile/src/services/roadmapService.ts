import { apiFetch } from './api';
import { TokenManager } from './token';

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
   */
  getMyRoadmaps: async (_period: string, _year: string, _dot: string): Promise<MeterRoute[]> => {
    const accessToken = await TokenManager.getAccessToken();
    const isMockToken = !!accessToken?.startsWith('mock-');

    try {
      // Gọi API thực từ backend (Thông qua Gateway - Construction Service)
      const response = await apiFetch(`/construction/roadmaps?page=0&size=100`, {
        silent: true,
      });

      const roadmapList = response.data?.content || response.data || [];

      if (roadmapList.length > 0) {
        return roadmapList.map((item: any) => ({
          id: item.roadmapId || item.id,
          name: item.name,
          type: item.lateralName || 'Tuyến ghi',
          totalCustomer: item.numberOfCustomers || 0,
          recorded: item.recorded || 0,
          unrecorded: item.unrecorded || 0,
          cutWater: 0,
          m3: item.m3 || '0',
          totalAmount: item.totalAmount || '0'
        }));
      }

      return [];
    } catch {
      console.log('[roadmapService] Returning empty list due to API unavailability');
      return [];
    }
  }
};

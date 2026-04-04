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

// const MOCK_DATA: MeterRoute[] = [
//   {
//     id: '5e6f7081-4000-4eee-9fff-eeeeeeee0001',
//     name: 'Tuyến số 1 (Hoàn Kiếm)',
//     type: '93Vc',
//     totalCustomer: 424,
//     recorded: 424,
//     unrecorded: 0,
//     cutWater: 0,
//     m3: '4.006',
//     totalAmount: '43.405.485',
//   },
//   {
//     id: '01C223',
//     name: 'Tuyến phố Huế',
//     type: '115.1',
//     totalCustomer: 429,
//     recorded: 428,
//     unrecorded: 1,
//     cutWater: 0,
//     m3: '4.374',
//     totalAmount: '43.764.735',
//   },
//   {
//     id: '01C452',
//     name: 'Tuyến Trường Chinh',
//     type: '97s',
//     totalCustomer: 1703,
//     recorded: 1702,
//     unrecorded: 1,
//     cutWater: 0,
//     m3: '17.842',
//     totalAmount: '191.314.690',
//   },
// ];

export const roadmapService = {
  /**
   * Lấy danh sách tuyến ghi chỉ số (Roadmaps) cho nhân viên hiện tại
   */
  getMyRoadmaps: async (_period: string, _year: string, _dot: string): Promise<MeterRoute[]> => {
    try {
      // Gọi API thực từ backend (Thông qua Gateway - Construction Service)
      const response = await apiFetch(`/construction/roadmaps?page=0&size=100`);
      
      const roadmapList = response.data?.content || response.data || [];
      
      if (roadmapList.length > 0) {
        return roadmapList.map((item: any) => ({
          id: item.roadmapId || item.id,
          name: item.name,
          type: item.lateralName || 'Tuyến ghi',
          totalCustomer: item.totalCustomer || 0,
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

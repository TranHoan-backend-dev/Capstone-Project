import { apiFetch } from './api';
import { TokenManager } from './token';

export type ReviewDecision = 'APPROVED' | 'REJECTED';

export interface MeterImageReviewItem {
  id: string;
  /** URL thô từ API (http/https hoặc gs://...) — hiển thị qua storageService.getImageUrl */
  imageUrl: string;
  customerName: string;
  customerAddress: string;
  /** Tên lộ trình ghi (hiển thị) */
  routeName: string;
  /** Id lộ trình nếu backend có — dùng để nhóm/chọn lộ trình */
  roadmapId: string;
  meterSerial: string;
  currentReading: string;
  previousReading: string;
}

export interface ReviewSubmitPayload {
  decision: ReviewDecision;
  note?: string;
  meterSerial?: string;
  currentReading?: string;
  previousReading?: string;
  roadmapId?: string;
}

/**
 * Chọn chuỗi URL ảnh ưu tiên từ payload backend (GCS public URL, gs://, hoặc path).
 */
export const pickRawImageUrlFromPayload = (item: Record<string, any>): string => {
  const candidates = [
    item.gcsUrl,
    item.gcsImageUrl,
    item.imageUrl,
    item.meterImageUrl,
    item.photoUrl,
    item.redditUrl,
    item.redditImageUrl,
    item.storageUrl,
    item.publicUrl,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c.trim();
  }
  return '';
};

const mapReviewItem = (item: any): MeterImageReviewItem => {
  const rawUrl = pickRawImageUrlFromPayload(item);
  const roadmapId = String(
    item.roadmapId ?? item.roadmap_id ?? item.routeId ?? item.roadmapUUID ?? ''
  );
  const routeName =
    item.roadmapName ||
    item.roadmap_name ||
    item.routeName ||
    item.route_name ||
    item.route ||
    'Chưa có lộ trình';

  return {
    id: String(item.id || item.meterReadingId || item.captureId || `temp-${Date.now()}`),
    imageUrl: rawUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
    customerName: item.customerName || item.name || item.fullName || 'Khách hàng chưa rõ',
    customerAddress: item.customerAddress || item.address || 'Chưa có địa chỉ',
    routeName,
    roadmapId,
    meterSerial: String(item.meterSerial ?? item.serial ?? item.serialNumber ?? 'N/A'),
    currentReading: String(item.currentReading ?? item.currentIndex ?? item.readingNow ?? item.newIndexAI ?? '0'),
    previousReading: String(item.previousReading ?? item.previousIndex ?? item.readingPrev ?? item.oldIndex ?? '0'),
  };
};

const mockReviewItems: MeterImageReviewItem[] = [
  {
    id: 'mock-review-001',
    imageUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1100&q=80',
    customerName: 'Nguyễn Văn A',
    customerAddress: '12 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    routeName: 'Tuyến HK-01',
    roadmapId: 'mock-r1',
    meterSerial: 'WM-2026-0001',
    currentReading: '356',
    previousReading: '342',
  },
  {
    id: 'mock-review-002',
    imageUrl: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1100&q=80',
    customerName: 'Trần Thị B',
    customerAddress: '88 Xã Đàn, Đống Đa, Hà Nội',
    routeName: 'Tuyến HK-01',
    roadmapId: 'mock-r1',
    meterSerial: 'WM-2026-0188',
    currentReading: '1024',
    previousReading: '998',
  },
  {
    id: 'mock-review-003',
    imageUrl: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1100&q=80',
    customerName: 'Lê Văn C',
    customerAddress: '5 Láng Hạ, Đống Đa',
    routeName: 'Tuyến DD-03',
    roadmapId: 'mock-r2',
    meterSerial: 'WM-2026-0200',
    currentReading: '88',
    previousReading: '80',
  },
];

export const routeKeyOfItem = (item: MeterImageReviewItem): string =>
  item.roadmapId || `name:${item.routeName}`;

class ImageReviewService {
  async getPendingImages(page: number = 0, size: number = 100): Promise<MeterImageReviewItem[]> {
    const accessToken = await TokenManager.getAccessToken();
    const isMockToken = !!accessToken?.startsWith('mock-');

    try {
      const response = await apiFetch(
        `/construction/meter-reading-images/pending?page=${page}&size=${size}`,
        {
          silent: true,
        }
      );

      const data = response.data?.content || response.data?.items || response.data || [];
      if (!Array.isArray(data)) return [];
      return data.map(mapReviewItem);
    } catch (error) {
      console.warn('[imageReviewService] Failed to fetch pending images:', error);
      return isMockToken ? mockReviewItems : [];
    }
  }

  async reviewImage(imageId: string, payload: ReviewSubmitPayload): Promise<void> {
    await apiFetch(`/construction/meter-reading-images/${imageId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

const imageReviewService = new ImageReviewService();

export default imageReviewService;

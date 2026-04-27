import { showToast } from '../utils/toast';
import { CONFIG } from '../config';

/**
 * Service để tương tác với ảnh đồng hồ nước
 * Hỗ trợ lấy ảnh từ GCS URL, tên file upload local, hoặc URL trực tiếp
 */
export const storageService = {
  /**
   * Chuyển đổi path/URL ảnh thành URL có thể hiển thị được
   * - Nếu là URL đầy đủ (https://): trả về nguyên
   * - Nếu là GCS path (gs://): chuyển sang https://storage.googleapis.com/...
   * - Nếu là tên file thuần (vd: "abc123.jpg"): gọi endpoint /d/usage/image/{fileName}
   * @param path Đường dẫn ảnh từ API
   */
  getImageUrl: async (path: string | null): Promise<string | null> => {
    if (!path) return null;

    try {
      // 1. URL đầy đủ (https hoặc http): trả về nguyên, ảnh GCS Signed URL cũng nằm đây
      if (path.startsWith('http')) {
        return path;
      }

      // 2. GCS path (gs://bucket/filename): chuyển sang HTTPS public URL
      if (path.startsWith('gs://')) {
        return path.replace('gs://', 'https://storage.googleapis.com/');
      }

      // 3. Tên file thuần (vd: "abc123.jpg" hoặc "uploads/images/abc.jpg"):
      //    Gọi đến endpoint backend GET /d/usage/image/{fileName} để phục vụ ảnh local
      const fileName = path.includes('/') ? path.split('/').pop() : path;
      if (fileName) {
        return `${CONFIG.API_BASE_URL}/d/usage/image/${encodeURIComponent(fileName)}`;
      }

      return path;
    } catch (error) {
      console.error('Error resolving image URL:', error);
      showToast.error('Không thể tải hình ảnh');
      return null;
    }
  }
};

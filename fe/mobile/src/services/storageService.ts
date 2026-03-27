import { showToast } from '../utils/toast';

/**
 * Service để tương tác với Google Cloud Storage
 * Hỗ trợ lấy ảnh từ các URL được trả về bởi API
 */
export const storageService = {
  /**
   * Chuyển đổi một GCS path hoặc URL thành URL có thể hiển thị được
   * @param path Đường dẫn ảnh từ API (ví dụ: gs://bucket/img.jpg hoặc https://...)
   */
  getImageUrl: async (path: string | null): Promise<string | null> => {
    if (!path) return null;

    try {
      // Giả lập xử lý URL Google Cloud Storage
      // Nếu là đường dẫn gs://, chúng ta có thể cần gọi API Backend 
      // để lấy Signed URL hoặc fetch blob từ GCS nếu bucket là public.
      
      /* Logic thực tế sẽ gọi đến GCS SDK hoặc REST API ở đây:
      const response = await fetch(`https://storage.googleapis.com/v1/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`, {
        headers: { Authorization: `Bearer ${GCS_TOKEN}` }
      });
      return response.url;
      */

      // Tạm thời trả về chính nó nếu đã là URL hợp lệ
      if (path.startsWith('http')) {
        return path;
      }
      
      // Mock chuyển đổi đường dẫn gs:// đơn giản
      return path.replace('gs://', 'https://storage.googleapis.com/');
    } catch (error) {
      console.error('Error fetching image from GCS:', error);
      showToast.error('Không thể tải hình ảnh từ Cloud Storage');
      return null;
    }
  }
};

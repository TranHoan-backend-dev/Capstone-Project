export interface OCRResult {
  serial: string;
  currentIndex: number;
  imageUrl: string;
}

/**
 * Service để tương tác với module AI OCR xử lý hình ảnh đồng hồ
 */
export const aiService = {
  /**
   * Gửi ảnh sang module AI để nhận diện chỉ số
   * @param imageUri URI của ảnh vừa chụp
   * @param serial Số serial của đồng hồ
   * @param lastIndex Chỉ số của tháng trước
   */
  processMeterImage: async (_imageUri: string, _serial: string, _lastIndex: number): Promise<OCRResult> => {
    // Luồng xử lý trực tiếp từ mobile sang AI worker đã bị loại bỏ.
    // Hiện tại ảnh sẽ được gửi qua backend (meterService.updateMeterIndex), và backend sẽ tự động trigger AI OCR.
    throw new Error('Direct mobile-to-AI processing is deprecated. Use backend services instead.');
  }
};

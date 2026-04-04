import Foundation

@objc class MediaRepository: NSObject {
    @objc static let shared = MediaRepository()

    private override init() {
        super.init()
    }

    func processCapturedImage(filePath: String, completion: @escaping (String?, Error?) -> Void) {
        // 1. Tải ảnh lên Google Cloud Storage (mô phỏng)
        DispatchQueue.global().asyncAfter(deadline: .now() + 1.0) {
            let mockUrl = "https://storage.googleapis.com/capstone-bucket/ios_capture_\(UUID().uuidString).jpg"
            
            // 2. Lưu URL vào backend
            // Tạm thời mô phỏng thành công
            completion(mockUrl, nil)
        }
    }

    func performOcr(imageUrl: String, completion: @escaping (String?, Error?) -> Void) {
        // Placeholder cho OCR
        completion("", nil)
    }
}

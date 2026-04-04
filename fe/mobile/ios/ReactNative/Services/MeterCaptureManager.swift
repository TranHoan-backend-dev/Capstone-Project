import Foundation

@objc class MeterCaptureManager: NSObject {
    @objc static let shared = MeterCaptureManager()

    private override init() {
        super.init()
    }

    func isImageBlurred(filePath: String) -> Bool {
        // Mô phỏng logic kiểm tra độ mờ (ví dụ dựa trên file size)
        if let attributes = try? FileManager.default.attributesOfItem(atPath: filePath) {
            if let size = attributes[.size] as? Int64 {
                return size < 1024
            }
        }
        return true
    }

    func sendToAiAsync(imagePath: String) {
        print("Sending image to AI asynchronously: \(imagePath)")
    }

    func getMockAiResults(imagePath: String) -> [String : Any] {
        var results = [String : Any]()
        results["serialNumber"] = "WT-\(arc4random_uniform(9000) + 1000)"
        results["readingValue"] = 100.0 + Double(arc4random_uniform(400)) + Double(arc4random_uniform(10)) * 0.1
        results["confidence"] = 0.95
        return results
    }
}

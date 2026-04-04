import Foundation

@objc class MeterRepository: NSObject {
    @objc static let shared = MeterRepository()
    private let captureManager = MeterCaptureManager.shared
    private var localDb = [MeterReading]()

    private override init() {
        super.init()
    }

    func captureMeterImage(completion: @escaping (String?, Error?) -> Void) {
        // Mock capture logic
        completion("path/to/captured_meter.jpg", nil)
    }

    func validateImageQuality(filePath: String) -> Bool {
        return !captureManager.isImageBlurred(filePath: filePath)
    }

    func submitToAiProcessing(reading: MeterReading) {
        captureManager.sendToAiAsync(imagePath: reading.imagePath)
        localDb.append(reading)
    }

    func getDailyReadings(timestamp: Int64) -> [MeterReading] {
        var results = [MeterReading]()
        for reading in localDb {
           // Trong iOS, ta có thể mô phỏng việc map kết quả AI tương tự Android
           // Ở đây đơn giản trả về localDb (hoặc mô phỏng thêm map nếu cần)
           results.append(reading)
        }
        return results
    }

    func saveMeterReading(reading: MeterReading) -> Bool {
        print("Saving meter reading: \(reading.serialNumber ?? "Unknown") - \(reading.readingValue)")
        return true
    }

    func updateManualMeterReading(readingId: String, serialNumber: String, readingValue: Double) -> Bool {
        for (index, reading) in localDb.enumerated() {
            if reading.id == readingId {
                let updated = MeterReading(id: readingId, serialNumber: serialNumber, readingValue: readingValue, imagePath: reading.imagePath, status: reading.status)
                localDb[index] = updated
                break
            }
        }
        print("Manually updated reading for \(readingId): \(serialNumber) - \(readingValue)")
        return true
    }
}

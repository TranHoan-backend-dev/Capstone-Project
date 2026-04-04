import Foundation
import React

@objc(MeterModule)
class MeterModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "MeterModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private let meterRepository = MeterRepository.shared

    @objc(saveMeterReading:resolver:rejecter:)
    func saveMeterReading(_ readingMap: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let id = readingMap["id"] as? String ?? UUID().uuidString
        let serialNumber = readingMap["serialNumber"] as? String
        let readingValue = readingMap["readingValue"] as? Double ?? 0.0
        let imagePath = readingMap["imagePath"] as? String ?? ""
        let status = readingMap["status"] as? String ?? "PENDING"
        
        let reading = MeterReading(id: id, serialNumber: serialNumber, readingValue: readingValue, imagePath: imagePath, status: status)
        let success = meterRepository.saveMeterReading(reading: reading)
        resolve(success)
    }

    @objc(updateManualMeterReading:serialNumber:readingValue:resolver:rejecter:)
    func updateManualMeterReading(_ readingId: String, serialNumber: String, readingValue: Double, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let success = meterRepository.updateManualMeterReading(readingId: readingId, serialNumber: serialNumber, readingValue: readingValue)
        resolve(success)
    }
}

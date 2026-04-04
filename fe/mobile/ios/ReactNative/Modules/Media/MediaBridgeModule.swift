import Foundation
import React

@objc(MediaModule)
class MediaModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "MediaModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private let mediaRepository = MediaRepository.shared
    private let permissionManager = PermissionManager.shared

    @objc(uploadCapturedImage:resolver:rejecter:)
    func uploadCapturedImage(_ filePath: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if !permissionManager.canAccessFullFeatures() {
            reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này", nil)
            return
        }

        mediaRepository.processCapturedImage(filePath: filePath) { resultUrl, error in
            if let error = error {
                reject("UPLOAD_ERROR", error.localizedDescription, error)
            } else {
                resolve(resultUrl)
            }
        }
    }

    @objc(performOcr:resolver:rejecter:)
    func performOcr(_ imageUrl: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if !permissionManager.canAccessFullFeatures() {
            reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này", nil)
            return
        }

        mediaRepository.performOcr(imageUrl: imageUrl) { ocrResult, error in
            if let error = error {
                reject("OCR_ERROR", error.localizedDescription, error)
            } else {
                resolve(ocrResult)
            }
        }
    }
}

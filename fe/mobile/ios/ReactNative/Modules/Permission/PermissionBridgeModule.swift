import Foundation
import React

@objc(PermissionModule)
class PermissionModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "PermissionModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private let permissionManager = PermissionManager.shared

    @objc(canAccessFullFeatures:rejecter:)
    func canAccessFullFeatures(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(permissionManager.canAccessFullFeatures())
    }

    @objc(canAccessModule:resolver:rejecter:)
    func canAccessModule(_ moduleName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(permissionManager.canAccessModule(moduleName: moduleName))
    }
}

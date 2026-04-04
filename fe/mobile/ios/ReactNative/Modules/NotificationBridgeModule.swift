import Foundation
import React

@objc(NotificationModule)
class NotificationModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "NotificationModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private let notificationRepository = NotificationRepository.shared

    @objc(getNotifications:size:resolver:rejecter:)
    func getNotifications(_ page: Int, size: Int, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        notificationRepository.getNotifications(page: page, size: size) { items, error in
            if let error = error {
                reject("NOTI_ERROR", error.localizedDescription, error)
            } else if let items = items {
                let results = items.map { item -> [String: Any?] in
                    return [
                        "notificationId": item.id,
                        "link": item.link,
                        "message": item.message,
                        "status": item.status,
                        "createdAt": item.createdAt
                    ]
                }
                resolve(results)
            }
        }
    }

    @objc(markAsRead:resolver:rejecter:)
    func markAsRead(_ notificationId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        notificationRepository.markAsRead(notificationId: notificationId) { success, error in
            if let error = error {
                reject("MARK_READ_ERROR", error.localizedDescription, error)
            } else {
                resolve(success)
            }
        }
    }
}

import Foundation

@objc class NotificationItem: NSObject {
    @objc var id: String
    @objc var link: String?
    @objc var message: String
    @objc var status: String
    @objc var createdAt: Int64

    init(id: String, link: String?, message: String, status: String, createdAt: Int64) {
        self.id = id
        self.link = link
        self.message = message
        self.status = status
        self.createdAt = createdAt
    }
}

@objc class NotificationRepository: NSObject {
    @objc static let shared = NotificationRepository()

    private override init() {
        super.init()
    }

    func getNotifications(page: Int, size: Int, completion: @escaping ([NotificationItem]?, Error?) -> Void) {
        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            let items = [
                NotificationItem(id: "1", link: nil, message: "Thông báo kiểm tra chỉ số nước mới.", status: "unread", createdAt: Int64(Date().timeIntervalSince1970 * 1000))
            ]
            completion(items, nil)
        }
    }

    func markAsRead(notificationId: String, completion: @escaping (Bool, Error?) -> Void) {
        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.2) {
            completion(true, nil)
        }
    }
}

import Foundation

@objc class UserProfile: NSObject {
    @objc var id: String?
    @objc var email: String?
    @objc var fullName: String?
    @objc var username: String?
    @objc var phoneNumber: String?
    @objc var role: String?
    @objc var avatarUrl: String?

    init(id: String?, email: String?, fullName: String?, username: String?, phoneNumber: String?, role: String?, avatarUrl: String?) {
        self.id = id
        self.email = email
        self.fullName = fullName
        self.username = username
        self.phoneNumber = phoneNumber
        self.role = role
        self.avatarUrl = avatarUrl
    }
}

@objc class MeterReading: NSObject {
    @objc var id: String
    @objc var serialNumber: String?
    @objc var readingValue: Double
    @objc var imagePath: String
    @objc var status: String

    init(id: String, serialNumber: String?, readingValue: Double, imagePath: String, status: String) {
        self.id = id
        self.serialNumber = serialNumber
        self.readingValue = readingValue
        self.imagePath = imagePath
        self.status = status
    }
}

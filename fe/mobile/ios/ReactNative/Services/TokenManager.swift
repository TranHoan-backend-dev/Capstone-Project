import Foundation
import Security

@objc class TokenManager: NSObject {
    private let service = "com.capstone.secure_prefs"
    private let account_accessToken = "access_token"
    private let account_refreshToken = "refresh_token"
    private let account_userRole = "user_role"

    @objc static let shared = TokenManager()

    private override init() {
        super.init()
    }

    func saveSession(accessToken: String, refreshToken: String?, role: String?) {
        save(key: account_accessToken, data: accessToken.data(using: .utf8)!)
        if let refreshToken = refreshToken {
            save(key: account_refreshToken, data: refreshToken.data(using: .utf8)!)
        }
        if let role = role {
            save(key: account_userRole, data: role.data(using: .utf8)!)
        }
    }

    func getUserRole() -> String? {
        if let data = load(key: account_userRole) {
            return String(data: data, encoding: .utf8)
        }
        return nil
    }

    func getAccessToken() -> String? {
        if let data = load(key: account_accessToken) {
            return String(data: data, encoding: .utf8)
        }
        return nil
    }

    func getRefreshToken() -> String? {
        if let data = load(key: account_refreshToken) {
            return String(data: data, encoding: .utf8)
        }
        return nil
    }

    func clearTokens() {
        delete(key: account_accessToken)
        delete(key: account_refreshToken)
        delete(key: account_userRole)
    }

    func hasToken() -> Bool {
        return getAccessToken() != nil
    }

    private func save(key: String, data: Data) {
        let query = [
            kSecClass as String       : kSecClassGenericPassword as String,
            kSecAttrService as String : service,
            kSecAttrAccount as String : key,
            kSecValueData as String   : data ] as [String : Any]

        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }

    private func load(key: String) -> Data? {
        let query = [
            kSecClass as String       : kSecClassGenericPassword,
            kSecAttrService as String : service,
            kSecAttrAccount as String : key,
            kSecReturnData as String  : kCFBooleanTrue!,
            kSecMatchLimit as String  : kSecMatchLimitOne ] as [String : Any]

        var dataTypeRef: AnyObject? = nil
        let status: OSStatus = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)

        if status == noErr {
            return dataTypeRef as? Data
        } else {
            return nil
        }
    }

    private func delete(key: String) {
        let query = [
            kSecClass as String       : kSecClassGenericPassword as String,
            kSecAttrService as String : service,
            kSecAttrAccount as String : key ] as [String : Any]

        SecItemDelete(query as CFDictionary)
    }
}

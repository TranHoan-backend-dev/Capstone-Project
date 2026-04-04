import Foundation

@objc class AuthRepository: NSObject {
    @objc static let shared = AuthRepository()

    private let tokenManager = TokenManager.shared
    private let bruteForceManager = AntiBruteForceManager.shared

    private override init() {
        super.init()
    }

    func login(accessToken: String, completion: @escaping (UserProfile?, Error?) -> Void) {
        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            let profile = UserProfile(id: "1", email: "user@example.com", fullName: "Test User", username: "testuser", phoneNumber: "0123456789", role: "BUSINESS_DEPARTMENT_EMPLOYEE", avatarUrl: nil)
            self.tokenManager.saveSession(accessToken: accessToken, refreshToken: "SIMULATED_REFRESH_TOKEN", role: profile.role)
            completion(profile, nil)
        }
    }

    func getAccessToken() -> String? {
        return tokenManager.getAccessToken()
    }

    func sendOtp(email: String, completion: @escaping (String?, Error?) -> Void) {
        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            completion("OTP sent to \(email)", nil)
        }
    }

    func verifyOtp(email: String, otp: String, completion: @escaping (String?, Error?) -> Void) {
        if bruteForceManager.isLocked(email: email) {
            completion(nil, NSError(domain: "Auth", code: 403, userInfo: [NSLocalizedDescriptionKey: "Tài khoản bị tạm khóa do thử sai quá nhiều lần. Vui lòng quay lại sau."]))
            return
        }

        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            if otp == "123456" {
                self.bruteForceManager.resetAttempts(email: email)
                completion("OTP verified", nil)
            } else {
                self.bruteForceManager.recordFailure(email: email)
                completion(nil, NSError(domain: "Auth", code: 401, userInfo: [NSLocalizedDescriptionKey: "OTP không chính xác"]))
            }
        }
    }

    func resetPassword(email: String, otp: String, newPass: String, completion: @escaping (String?, Error?) -> Void) {
        if bruteForceManager.isLocked(email: email) {
            completion(nil, NSError(domain: "Auth", code: 403, userInfo: [NSLocalizedDescriptionKey: "Tài khoản đang bị khóa."]))
            return
        }

        // Mock logic matches Android's Repo implementation (delegating check and recording)
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            // Simplified: success case
            self.bruteForceManager.resetAttempts(email: email)
            completion("Mật khẩu đã được đặt lại thành công", nil)
        }
    }

    func changePassword(oldPass: String, newPass: String, completion: @escaping (String?, Error?) -> Void) {
        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            completion("Mật khẩu đã được thay đổi", nil)
        }
    }

    func getMe(completion: @escaping (UserProfile?, Error?) -> Void) {
        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            let profile = UserProfile(id: "1", email: "user@example.com", fullName: "Test User", username: "testuser", phoneNumber: "0123456789", role: "BUSINESS_DEPARTMENT_EMPLOYEE", avatarUrl: nil)
            completion(profile, nil)
        }
    }

    func logout() {
        tokenManager.clearTokens()
    }
}

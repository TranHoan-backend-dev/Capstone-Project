import Foundation

@objc class AntiBruteForceManager: NSObject {
    private static let MAX_ATTEMPTS = 5
    private static let LOCK_TIME_MS: Int64 = 5 * 60 * 1000 // 5 minutes

    @objc static let shared = AntiBruteForceManager()

    private var attemptsMap = [String : Int]()
    private var lockTimestampMap = [String : Int64]()

    private override init() {
        super.init()
    }

    func isLocked(email: String) -> Bool {
        if let lockTime = lockTimestampMap[email] {
            let now = Int64(Date().timeIntervalSince1970 * 1000)
            if now < lockTime + AntiBruteForceManager.LOCK_TIME_MS {
                return true
            }
            // Tiết kiệm bộ nhớ: xóa khi đã hết hạn
            lockTimestampMap.removeValue(forKey: email)
            attemptsMap.removeValue(forKey: email)
        }
        return false
    }

    func recordFailure(email: String) {
        let count = (attemptsMap[email] ?? 0) + 1
        attemptsMap[email] = count
        if count >= AntiBruteForceManager.MAX_ATTEMPTS {
            lockTimestampMap[email] = Int64(Date().timeIntervalSince1970 * 1000)
        }
    }

    func resetAttempts(email: String) {
        attemptsMap.removeValue(forKey: email)
        lockTimestampMap.removeValue(forKey: email)
    }
}

import Foundation

@objc class PaymentInfo: NSObject {
    @objc var paymentId: String
    @objc var amount: Double
    @objc var status: String
    @objc var createdAt: Int64

    init(paymentId: String, amount: Double, status: String, createdAt: Int64) {
        self.paymentId = paymentId
        self.amount = amount
        self.status = status
        self.createdAt = createdAt
    }
}

@objc class PaymentRepository: NSObject {
    @objc static let shared = PaymentRepository()

    private override init() {
        super.init()
    }

    func getPayments(completion: @escaping ([PaymentInfo]?, Error?) -> Void) {
        // Mocking API call
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
            let items = [
                PaymentInfo(paymentId: "P-001", amount: 150000.0, status: "PAID", createdAt: Int64(Date().timeIntervalSince1970 * 1000))
            ]
            completion(items, nil)
        }
    }
}

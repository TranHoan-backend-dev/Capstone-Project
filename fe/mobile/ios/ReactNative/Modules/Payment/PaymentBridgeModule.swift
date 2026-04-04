import Foundation
import React

@objc(PaymentModule)
class PaymentModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "PaymentModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private let paymentRepository = PaymentRepository.shared

    @objc(getPayments:rejecter:)
    func getPayments(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        paymentRepository.getPayments { items, error in
            if let error = error {
                reject("PAYMENT_ERROR", error.localizedDescription, error)
            } else if let items = items {
                let results = items.map { item -> [String: Any] in
                    return [
                        "paymentId": item.paymentId,
                        "amount": item.amount,
                        "status": item.status,
                        "createdAt": item.createdAt
                    ]
                }
                resolve(results)
            }
        }
    }
}

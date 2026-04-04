import Foundation
import React

@objc(AuthModule)
class AuthModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "AuthModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private let authRepository = AuthRepository.shared

    @objc(getAccessToken:rejecter:)
    func getAccessToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let token = authRepository.getAccessToken()
        resolve(token)
    }

    @objc(hasToken:rejecter:)
    func hasToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(authRepository.getAccessToken() != nil)
    }

    @objc(logout:rejecter:)
    func logout(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        authRepository.logout()
        resolve(true)
    }

    @objc(login:resolver:rejecter:)
    func login(_ accessToken: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        authRepository.login(accessToken: accessToken) { profile, error in
            if let error = error {
                reject("LOGIN_ERROR", error.localizedDescription, error)
            } else if let profile = profile {
                let profileMap: [String: Any?] = [
                    "id": profile.id,
                    "email": profile.email,
                    "fullName": profile.fullName,
                    "username": profile.username,
                    "phoneNumber": profile.phoneNumber,
                    "role": profile.role,
                    "avatarUrl": profile.avatarUrl
                ]
                resolve(profileMap)
            }
        }
    }

    @objc(sendOtp:resolver:rejecter:)
    func sendOtp(_ email: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        authRepository.sendOtp(email: email) { message, error in
            if let error = error {
                reject("OTP_ERROR", error.localizedDescription, error)
            } else {
                resolve(message)
            }
        }
    }

    @objc(verifyOtp:otp:resolver:rejecter:)
    func verifyOtp(_ email: String, otp: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        authRepository.verifyOtp(email: email, otp: otp) { message, error in
            if let error = error {
                reject("VERIFY_ERROR", error.localizedDescription, error)
            } else {
                resolve(message)
            }
        }
    }

    @objc(resetPassword:otp:newPassword:resolver:rejecter:)
    func resetPassword(_ email: String, otp: String, newPassword: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        authRepository.resetPassword(email: email, otp: otp, newPass: newPassword) { message, error in
            if let error = error {
                reject("RESET_ERROR", error.localizedDescription, error)
            } else {
                resolve(message)
            }
        }
    }

    @objc(changePassword:newPass:resolver:rejecter:)
    func changePassword(_ oldPass: String, newPass: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        authRepository.changePassword(oldPass: oldPass, newPass: newPass) { message, error in
            if let error = error {
                reject("CHANGE_ERROR", error.localizedDescription, error)
            } else {
                resolve(message)
            }
        }
    }

    @objc(getMe:rejecter:)
    func getMe(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        authRepository.getMe { profile, error in
            if let error = error {
                reject("GET_ME_ERROR", error.localizedDescription, error)
            } else if let profile = profile {
                let profileMap: [String: Any?] = [
                    "id": profile.id,
                    "email": profile.email,
                    "fullName": profile.fullName,
                    "username": profile.username,
                    "phoneNumber": profile.phoneNumber,
                    "role": profile.role,
                    "avatarUrl": profile.avatarUrl
                ]
                resolve(profileMap)
            }
        }
    }
}

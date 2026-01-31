package com.capstone.bridge

import com.capstone.domain.repository.AuthRepository
import com.facebook.react.bridge.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class AuthBridgeModule(
    reactContext: ReactApplicationContext,
    private val authRepository: AuthRepository
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun getName(): String = "AuthModule"

    /**
     * Thực hiện đăng nhập bằng Access Token từ Keycloak.
     * Luồng: JavaScript -> AuthModule.login -> Repository.login -> Backend -> Trả về Profile
     */
    @ReactMethod
    fun login(accessToken: String, promise: Promise) {
        scope.launch {
            try {
                val profile = authRepository.login(accessToken)
                val map = Arguments.createMap().apply {
                    putString("fullName", profile.fullName)
                    putString("avatarUrl", profile.avatarUrl)
                    putString("role", profile.role)
                    putString("username", profile.username)
                    putString("email", profile.email)
                }
                promise.resolve(map)
            } catch (e: Exception) {
                promise.reject("LOGIN_ERROR", e.message, e)
            }
        }
    }

    /**
     * Gửi yêu cầu mã OTP về email để thực hiện quên mật khẩu.
     * Luồng: JavaScript -> AuthModule.sendOtp -> Repository.sendOtp -> Backend -> Gửi Email
     */
    @ReactMethod
    fun sendOtp(email: String, promise: Promise) {
        scope.launch {
            try {
                val message = authRepository.sendOtp(email)
                promise.resolve(message)
            } catch (e: Exception) {
                promise.reject("SEND_OTP_ERROR", e.message, e)
            }
        }
    }

    /**
     * Xác thực mã OTP mà người dùng nhập vào.
     * Luồng: JavaScript -> AuthModule.verifyOtp -> Repository.verifyOtp -> Backend -> Kiểm tra OTP
     */
    @ReactMethod
    fun verifyOtp(email: String, otp: String, promise: Promise) {
        scope.launch {
            try {
                val message = authRepository.verifyOtp(email, otp)
                promise.resolve(message)
            } catch (e: Exception) {
                promise.reject("VERIFY_OTP_ERROR", e.message, e)
            }
        }
    }

    /**
     * Đặt lại mật khẩu mới sử dụng kèm mã OTP đã xác thực.
     * Luồng: JavaScript -> AuthModule.resetPassword -> Repository.resetPassword -> Backend -> Cập nhật Pass
     */
    @ReactMethod
    fun resetPassword(email: String, otp: String, newPassword: String, promise: Promise) {
        scope.launch {
            try {
                val message = authRepository.resetPassword(email, otp, newPassword)
                promise.resolve(message)
            } catch (e: Exception) {
                promise.reject("RESET_PASSWORD_ERROR", e.message, e)
            }
        }
    }

    /**
     * Lấy thông tin cá nhân của người dùng hiện tại dựa trên token.
     * Luồng: JavaScript -> AuthModule.getMe -> Repository.getMe -> Backend -> Trả về Profile
     */
    @ReactMethod
    fun getMe(accessToken: String, promise: Promise) {
        scope.launch {
            try {
                val profile = authRepository.getMe(accessToken)
                val map = Arguments.createMap().apply {
                    putString("fullName", profile.fullName)
                    putString("avatarUrl", profile.avatarUrl)
                    putString("role", profile.role)
                    putString("username", profile.username)
                    putString("email", profile.email)
                }
                promise.resolve(map)
            } catch (e: Exception) {
                promise.reject("GET_ME_ERROR", e.message, e)
            }
        }
    }
}

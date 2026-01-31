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

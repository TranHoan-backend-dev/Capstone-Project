package com.capstone.infrastructure.security

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext context: Context
) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val sharedPrefs = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    companion object {
        private const val ACCESS_TOKEN = "access_token"
        private const val REFRESH_TOKEN = "refresh_token"
        private const val USER_ROLE = "user_role"
    }

    /**
     * Lưu trữ phiên làm việc gồm Token và Role.
     */
    fun saveSession(accessToken: String, refreshToken: String?, role: String?) {
        sharedPrefs.edit().apply {
            putString(ACCESS_TOKEN, accessToken)
            refreshToken?.let { putString(REFRESH_TOKEN, it) }
            role?.let { putString(USER_ROLE, it) }
            apply()
        }
    }

    /**
     * Lấy Role của người dùng hiện tại.
     */
    fun getUserRole(): String? = sharedPrefs.getString(USER_ROLE, null)

    /**
     * Lấy Access Token hiện tại.
     */
    fun getAccessToken(): String? = sharedPrefs.getString(ACCESS_TOKEN, null)

    /**
     * Lấy Refresh Token hiện tại.
     */
    fun getRefreshToken(): String? = sharedPrefs.getString(REFRESH_TOKEN, null)

    /**
     * Xóa toàn bộ token (khi logout).
     */
    fun clearTokens() {
        sharedPrefs.edit().clear().apply()
    }

    /**
     * Kiểm tra xem người dùng đã có token chưa.
     */
    fun hasToken(): Boolean = getAccessToken() != null
}

package com.capstone.infrastructure.security

import com.capstone.common.utils.Constants
import okhttp3.Authenticator
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Authenticator tự động xử lý khi nhận lỗi 401 (Unauthorized).
 * Nó thực hiện Refresh Token và gửi lại request ban đầu với token mới.
 */
@Singleton
class TokenAuthenticator @Inject constructor(
    private val tokenManager: TokenManager
) : Authenticator {

    override fun authenticate(route: Route?, response: Response): Request? {
        // Nếu đã thử refresh rồi mà vẫn lỗi thì thôi
        if (responseCount(response) >= 2) {
            return null
        }

        val refreshToken = tokenManager.getRefreshToken() ?: return null

        synchronized(this) {
            // Kiểm tra lại xem token đã được cái thread khác refresh chưa
            val currentToken = tokenManager.getAccessToken()
            
            // Logic call API Refresh Token ở đây
            // Vì đây là tầng hạ tầng, ta sử dụng một OkHttpClient thuần để tránh interceptor
            val newToken = refreshAccessToken(refreshToken)

            return if (newToken != null) {
                response.request.newBuilder()
                    .header("Authorization", "Bearer $newToken")
                    .build()
            } else {
                null
            }
        }
    }

    private fun refreshAccessToken(refreshToken: String): String? {
        // TRONG THỰC TẾ: Bạn sẽ call API endpoint của Keycloak hoặc Backend ở đây
        // Gửi POST request kèm refresh_token
        
        // GIẢ LẬP:
        // val response = okHttpClient.newCall(request).execute()
        // if (response.isSuccessful) { ... save new tokens ... return accessToken }
        
        return null // Return null để trigger logout hoặc handle lỗi
    }

    private fun responseCount(response: Response): Int {
        var result = 1
        var res = response.priorResponse
        while (res != null) {
            result++
            res = res.priorResponse
        }
        return result
    }
}

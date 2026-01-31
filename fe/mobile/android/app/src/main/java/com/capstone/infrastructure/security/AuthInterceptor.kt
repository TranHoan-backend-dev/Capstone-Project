package com.capstone.infrastructure.security

import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Interceptor tự động thêm Header Authorization: Bearer <Token> vào các request.
 */
@Singleton
class AuthInterceptor @Inject constructor(
    private val tokenManager: TokenManager
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val requestBuilder = originalRequest.newBuilder()

        // Kiểm tra xem request có yêu cầu bỏ qua token không (hoặc là auth public urls)
        val shouldAddToken = originalRequest.header("No-Authentication") == null

        if (shouldAddToken) {
            tokenManager.getAccessToken()?.let {
                requestBuilder.addHeader("Authorization", "Bearer $it")
            }
        }

        return chain.proceed(requestBuilder.build())
    }
}

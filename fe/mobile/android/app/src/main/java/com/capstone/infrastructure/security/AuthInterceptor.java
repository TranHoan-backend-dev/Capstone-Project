package com.capstone.infrastructure.security;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.IOException;

/**
 * Interceptor tự động thêm Header Authorization: Bearer <Token> vào các request gọi API Backend.
 */
@Singleton
public class AuthInterceptor implements Interceptor {

    private final TokenManager tokenManager;

    @Inject
    public AuthInterceptor(TokenManager tokenManager) {
        this.tokenManager = tokenManager;
    }

    @Override
    public Response intercept(Interceptor.Chain chain) throws IOException {
        Request originalRequest = chain.request();
        Request.Builder requestBuilder = originalRequest.newBuilder();

        // Kiểm tra xem request có yêu cầu bỏ qua token không (Header No-Authentication)
        boolean shouldAddToken = originalRequest.header("No-Authentication") == null;

        if (shouldAddToken) {
            String accessToken = tokenManager.getAccessToken();
            if (accessToken != null) {
                requestBuilder.addHeader("Authorization", "Bearer " + accessToken);
            }
        }

        return chain.proceed(requestBuilder.build());
    }
}

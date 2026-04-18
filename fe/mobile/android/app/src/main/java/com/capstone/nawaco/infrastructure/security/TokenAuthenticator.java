package com.capstone.nawaco.infrastructure.security;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.jetbrains.annotations.Contract;

import okhttp3.Authenticator;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.Route;

import javax.inject.Inject;
import javax.inject.Singleton;

import java.io.IOException;

/**
 * Authenticator tự động xử lý khi nhận lỗi 401 (Unauthorized) từ Backend.
 * Nó thực hiện Refresh Token và gửi lại request ban đầu với token mới nếu refresh thành công.
 */
@Singleton
public class TokenAuthenticator implements Authenticator {

    private final TokenManager tokenManager;

    @Inject
    public TokenAuthenticator(TokenManager tokenManager) {
        this.tokenManager = tokenManager;
    }

    @Override
    public Request authenticate(Route route, @NonNull Response response) throws IOException {
        // Nếu đã thử refresh rồi mà vẫn lỗi 401 thì dừng (tránh vòng lặp vô tận)
        if (responseCount(response) >= 2) {
            return null;
        }

        var refreshToken = tokenManager.getRefreshToken();
        if (refreshToken == null) {
            return null;
        }

        synchronized (this) {
            // Kiểm tra lại xem token đã được một thread khác refresh chưa trong khi thread hiện tại đang đợi

            // Logic call API Refresh Token tại đây.
            // Trong thực tế sẽ gọi lên máy chủ Keycloak/Backend để đổi refresh_token lấy access_token mới.
            var newToken = refreshAccessToken(refreshToken);

            if (newToken != null) {
                // Thêm header Authorization mới và gửi lại request cũ
                return response.request().newBuilder()
                        .header("Authorization", "Bearer " + newToken)
                        .build();
            } else {
                // Không refresh được, logout hoặc yêu cầu đăng nhập lại
                return null;
            }
        }
    }

    /**
     * Thực hiện lời gọi API đồng bộ để lấy Access Token mới từ Refresh Token.
     */
    @Nullable
    @Contract(pure = true)
    private String refreshAccessToken(String refreshToken) {
        // GIẢ LẬP: Thực hiện call API bằng OkHttpClient thuần (không có Authenticator này để tránh recursion)
        // Response response = client.newCall(refreshRequest).execute();
        // if (response.isSuccessful()) { ... lưu token mới ... return accessToken; }

        return null; // Trả về null để trigger quy trình logout hoặc thông báo hết hạn phiên.
    }

    /**
     * Đếm số lần request đã được retry để tránh infinite loop khi token bị hỏng/hết hạn thực sự.
     */
    private int responseCount(@NonNull Response response) {
        var result = 1;
        var prior = response.priorResponse();
        while (prior != null) {
            result++;
            prior = prior.priorResponse();
        }
        return result;
    }
}

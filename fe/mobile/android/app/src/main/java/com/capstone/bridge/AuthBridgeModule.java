package com.capstone.bridge;

import com.capstone.domain.model.UserProfile;
import com.capstone.domain.repository.AuthRepository;
import com.facebook.react.bridge.*;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class AuthBridgeModule extends ReactContextBaseJavaModule {
    private final AuthRepository authRepository;
    private final ExecutorService executorService;

    public AuthBridgeModule(ReactApplicationContext reactContext, AuthRepository authRepository) {
        super(reactContext);
        this.authRepository = authRepository;
        this.executorService = Executors.newFixedThreadPool(4);
    }

    @Override
    public String getName() {
        return "AuthModule";
    }

    @ReactMethod
    public void login(final String accessToken, final Promise promise) {
        executorService.execute(() -> {
            try {
                UserProfile profile = authRepository.login(accessToken);
                WritableMap map = Arguments.createMap();
                map.putString("fullName", profile.getFullName());
                map.putString("avatarUrl", profile.getAvatarUrl());
                map.putString("role", profile.getRole());
                map.putString("username", profile.getUsername());
                map.putString("email", profile.getEmail());
                promise.resolve(map);
            } catch (Exception e) {
                promise.reject("LOGIN_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void sendOtp(final String email, final Promise promise) {
        executorService.execute(() -> {
            try {
                String message = authRepository.sendOtp(email);
                promise.resolve(message);
            } catch (Exception e) {
                promise.reject("SEND_OTP_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void verifyOtp(final String email, final String otp, final Promise promise) {
        executorService.execute(() -> {
            try {
                String message = authRepository.verifyOtp(email, otp);
                promise.resolve(message);
            } catch (Exception e) {
                promise.reject("VERIFY_OTP_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void resetPassword(final String email, final String otp, final String newPassword, final Promise promise) {
        executorService.execute(() -> {
            try {
                String message = authRepository.resetPassword(email, otp, newPassword);
                promise.resolve(message);
            } catch (Exception e) {
                promise.reject("RESET_PASSWORD_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void getMe(final Promise promise) {
        executorService.execute(() -> {
            try {
                UserProfile profile = authRepository.getMe();
                WritableMap map = Arguments.createMap();
                map.putString("fullName", profile.getFullName());
                map.putString("avatarUrl", profile.getAvatarUrl());
                map.putString("role", profile.getRole());
                map.putString("username", profile.getUsername());
                map.putString("email", profile.getEmail());
                promise.resolve(map);
            } catch (Exception e) {
                promise.reject("GET_ME_ERROR", e.message, e);
            }
        });
    }
}

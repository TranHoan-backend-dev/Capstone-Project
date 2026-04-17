package com.capstone.nawaco.domain.usecase;

import com.capstone.nawaco.common.utils.Result;
import com.capstone.nawaco.domain.repository.AuthRepository;

import javax.inject.Inject;

/**
 * Use case xử lý quy trình quên mật khẩu bao gồm gửi OTP, xác thực và đặt lại mật khẩu.
 */
public class ForgotPasswordUseCase {
    private final AuthRepository authRepository;

    @Inject
    public ForgotPasswordUseCase(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    /**
     * Gửi yêu cầu mã OTP khôi phục mật khẩu đến Email người dùng.
     */
    public Result<String> sendOtp(String email) {
        try {
            var message = authRepository.sendOtp(email);
            return Result.success(message);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }

    /**
     * Xác thực mã OTP mà người dùng đã nhập.
     */
    public Result<String> verifyOtp(String email, String otp) {
        try {
            var message = authRepository.verifyOtp(email, otp);
            return Result.success(message);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }

    /**
     * Thực hiện đặt lại mật khẩu mới cho tài khoản.
     */
    public Result<String> resetPassword(String email, String otp, String newPass) {
        try {
            String message = authRepository.resetPassword(email, otp, newPass);
            return Result.success(message);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }
}

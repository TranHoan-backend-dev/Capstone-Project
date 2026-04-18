package com.capstone.nawaco.domain.usecase;

import androidx.annotation.NonNull;

import com.capstone.nawaco.common.utils.Result;
import com.capstone.nawaco.domain.repository.AuthRepository;

import javax.inject.Inject;

/**
 * Use case để thực hiện thay đổi mật khẩu cho người dùng đã đăng nhập.
 */
public class ChangePasswordUseCase {
    private final AuthRepository authRepository;

    @Inject
    public ChangePasswordUseCase(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    /**
     * Thực hiện đổi mật khẩu khi đã đăng nhập.
     * Kiểm tra logic cũ - mới và khớp mật khẩu trước khi gọi Repository.
     */
    public Result<String> execute(String oldPass, @NonNull String newPass, String confirmPass) {
        if (!newPass.equals(confirmPass)) {
            return Result.failure(new Exception("Mật khẩu mới và xác nhận mật khẩu không khớp."));
        }

        if (oldPass.equals(newPass)) {
            return Result.failure(new Exception("Mật khẩu mới không được trùng với mật khẩu cũ."));
        }

        try {
            var message = authRepository.changePassword(oldPass, newPass);
            return Result.success(message);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }
}

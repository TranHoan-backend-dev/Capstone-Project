package com.capstone.domain.usecase;

import com.capstone.common.utils.Result;
import com.capstone.domain.model.UserProfile;
import com.capstone.domain.repository.AuthRepository;

import javax.inject.Inject;

/**
 * Use case lấy thông tin cá nhân của người dùng hiện tại từ Backend.
 */
public class GetProfileUseCase {
    private final AuthRepository authRepository;

    @Inject
    public GetProfileUseCase(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    /**
     * Lấy thông tin profile của người dùng hiện tại đã đăng nhập.
     */
    public Result<UserProfile> execute() {
        try {
            var profile = authRepository.getMe();
            return Result.success(profile);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }
}

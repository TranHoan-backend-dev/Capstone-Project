package com.capstone.domain.usecase;

import com.capstone.common.utils.Result;
import com.capstone.domain.model.UserProfile;
import com.capstone.domain.repository.AuthRepository;
import androidx.annotation.Nullable;
import javax.inject.Inject;

/**
 * Use case xử lý cập nhật thông tin cá nhân và ảnh đại diện của người dùng.
 */
public class UpdateProfileUseCase {
    private final AuthRepository authRepository;

    @Inject
    public UpdateProfileUseCase(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    /**
     * Cập nhật thông tin profile của người dùng.
     * Chấp nhận các giá trị null cho những trường không thay đổi.
     */
    public Result<UserProfile> updateInfo(
        @Nullable String fullName,
        @Nullable String username,
        @Nullable String phoneNumber,
        @Nullable String birthdate,
        @Nullable String address,
        @Nullable Boolean gender
    ) {
        try {
            UserProfile profile = authRepository.updateProfile(fullName, username, phoneNumber, birthdate, address, gender);
            return Result.success(profile);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }

    /**
     * Cập nhật ảnh đại diện người dùng từ mảng byte.
     */
    public Result<UserProfile> updateAvatar(byte[] imageBytes) {
        try {
            UserProfile profile = authRepository.updateAvatar(imageBytes);
            return Result.success(profile);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }
}

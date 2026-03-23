package com.capstone.domain.usecase;

import com.capstone.common.utils.Result;
import com.capstone.domain.model.UserProfile;
import com.capstone.domain.repository.AuthRepository;

import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

/**
 * Use case xử lý logic đăng nhập và kiểm tra quyền truy cập hệ thống di động.
 */
public class LoginUseCase {
    private final AuthRepository authRepository;

    @Inject
    public LoginUseCase(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    /**
     * Thực hiện đăng nhập và kiểm tra quyền truy cập.
     * Chỉ nhân viên thuộc "Phòng Kinh doanh" hoặc IT mới được phép truy cập.
     */
    public Result<UserProfile> execute(String accessToken) {
        try {
            var userProfile = authRepository.login(accessToken);

            // Danh sách các role được phép sử dụng ứng dụng mobile
            List<String> allowedRoles = Arrays.asList(
                    "METER_INSPECTION_STAFF",
                    "BUSINESS_DEPARTMENT_HEAD",
                    "IT_STAFF"
            );

            var userRole = userProfile.getRole().toUpperCase();

            if (allowedRoles.contains(userRole)) {
                return Result.success(userProfile);
            } else {
                return Result.failure(new Exception("Truy cập bị từ chối. Ứng dụng này chỉ dành cho nhân viên thuộc bộ phận Kinh doanh."));
            }
        } catch (Exception e) {
            return Result.failure(e);
        }
    }
}

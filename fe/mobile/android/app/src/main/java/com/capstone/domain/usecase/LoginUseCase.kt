package com.capstone.domain.usecase

import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository
import javax.inject.Inject

class LoginUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    /**
     * Thực hiện đăng nhập và kiểm tra quyền truy cập.
     * Chỉ nhân viên thuộc "Phòng Kinh doanh" mới được phép truy cập ứng dụng mobile.
     */
    suspend fun execute(accessToken: String): Result<UserProfile> {
        return try {
            val userProfile = authRepository.login(accessToken)
            
            // Giới hạn truy cập: Kiểm tra role của người dùng.
            // Các role được phép: METER_INSPECTION_STAFF (Nhân viên kiểm tra đồng hồ), BUSINESS_DEPARTMENT_HEAD (Trưởng phòng kinh doanh)
            // Cho phép thêm IT_STAFF để quản trị/test.
            val allowedRoles = listOf(
                "METER_INSPECTION_STAFF", 
                "BUSINESS_DEPARTMENT_HEAD", 
                "IT_STAFF"
            )
            
            val userRole = userProfile.role.uppercase()
            
            if (allowedRoles.contains(userRole)) {
                Result.success(userProfile)
            } else {
                Result.failure(Exception("Truy cập bị từ chối. Ứng dụng này chỉ dành cho nhân viên thuộc bộ phận Kinh doanh."))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

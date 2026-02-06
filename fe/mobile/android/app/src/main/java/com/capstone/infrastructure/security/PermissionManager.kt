package com.capstone.infrastructure.security

import javax.inject.Inject
import javax.inject.Singleton

/**
 * Quản lý quyền truy cập dựa trên Role của người dùng.
 */
@Singleton
class PermissionManager @Inject constructor(
    private val tokenManager: TokenManager
) {
    companion object {
        const val ROLE_BUSINESS_EMPLOYEE = "BUSINESS_DEPARTMENT_EMPLOYEE"
    }

    /**
     * Kiểm tra xem người dùng có quyền sử dụng các tính năng chuyên sâu của hệ thống hay không.
     * Logic: Chỉ BUSINESS_DEPARTMENT_EMPLOYEE mới được sử dụng full tính năng.
     */
    fun canAccessFullFeatures(): Boolean {
        val currentRole = tokenManager.getUserRole()
        return currentRole == ROLE_BUSINESS_EMPLOYEE
    }

    /**
     * Kiểm tra quyền truy cập cho một module cụ thể.
     */
    fun canAccessModule(moduleName: String): Boolean {
        // Các module cơ bản mà ai cũng có thể vào
        val publicModules = listOf("HOME", "AUTH", "PROFILE")
        
        if (publicModules.contains(moduleName.uppercase())) {
            return true
        }

        // Các module nghiệp vụ yêu cầu quyền chuyên biệt
        return canAccessFullFeatures()
    }
}

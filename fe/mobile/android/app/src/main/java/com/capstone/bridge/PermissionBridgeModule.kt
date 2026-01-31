package com.capstone.bridge

import com.capstone.infrastructure.security.PermissionManager
import com.facebook.react.bridge.*

/**
 * Module cung cấp các hàm kiểm tra phân quyền cho React Native.
 */
class PermissionBridgeModule(
    reactContext: ReactApplicationContext,
    private val permissionManager: PermissionManager
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "PermissionModule"

    /**
     * Kiểm tra xem người dùng có quyền BUSINESS_DEPARTMENT_EMPLOYEE hay không.
     */
    @ReactMethod
    fun canAccessFullFeatures(promise: Promise) {
        promise.resolve(permissionManager.canAccessFullFeatures())
    }

    /**
     * Kiểm tra quyền truy cập của một module cụ thể.
     */
    @ReactMethod
    fun canAccessModule(moduleName: String, promise: Promise) {
        promise.resolve(permissionManager.canAccessModule(moduleName))
    }
}

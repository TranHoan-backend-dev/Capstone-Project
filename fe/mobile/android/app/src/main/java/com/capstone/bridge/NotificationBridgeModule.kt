package com.capstone.bridge

import com.capstone.domain.repository.NotificationRepository
import com.facebook.react.bridge.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.capstone.infrastructure.security.PermissionManager

class NotificationBridgeModule(
    reactContext: ReactApplicationContext,
    private val repository: NotificationRepository,
    private val permissionManager: PermissionManager
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun getName(): String = "NotificationModule"

    /**
     * Lấy danh sách thông báo có phân trang.
     * Luồng: JavaScript -> NotificationModule -> Repository -> API Backend -> Trả về mảng JSON
     */
    @ReactMethod
    fun getNotifications(page: Int, size: Int, promise: Promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
            return
        }
        scope.launch {
            try {
                val notifications = repository.getNotifications(page, size)
                val list = Arguments.createArray()
                notifications.forEach { notification ->
                    val map = Arguments.createMap().apply {
                        putString("id", notification.id)
                        putString("link", notification.link)
                        putString("message", notification.message)
                        putBoolean("isRead", notification.isRead)
                        putString("createdAt", notification.createdAt)
                    }
                    list.pushMap(map)
                }
                promise.resolve(list)
            } catch (e: Exception) {
                promise.reject("GET_NOTIFICATIONS_ERROR", e.message, e)
            }
        }
    }

    /**
     * Đánh dấu một thông báo là đã đọc.
     * Luồng: JavaScript -> NotificationModule -> Repository -> API Backend -> Cập nhật status
     */
    @ReactMethod
    fun markAsRead(notificationId: String, promise: Promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
            return
        }
        scope.launch {
            try {
                val success = repository.markAsRead(notificationId)
                promise.resolve(success)
            } catch (e: Exception) {
                promise.reject("MARK_READ_ERROR", e.message, e)
            }
        }
    }
}

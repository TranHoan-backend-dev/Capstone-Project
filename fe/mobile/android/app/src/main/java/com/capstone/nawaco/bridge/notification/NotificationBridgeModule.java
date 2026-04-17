package com.capstone.bridge.notification;

import com.capstone.domain.model.Notification;
import com.capstone.domain.repository.NotificationRepository;
import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class NotificationBridgeModule extends ReactContextBaseJavaModule {
    private final NotificationRepository repository;
    private final PermissionManager permissionManager;
    private final ExecutorService executorService;

    public NotificationBridgeModule(ReactApplicationContext reactContext,
                                    NotificationRepository repository,
                                    PermissionManager permissionManager) {
        super(reactContext);
        this.repository = repository;
        this.permissionManager = permissionManager;
        this.executorService = Executors.newFixedThreadPool(4);
    }

    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void getNotifications(final int page, final int size, final Promise promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này");
            return;
        }

        executorService.execute(() -> {
            try {
                List<Notification> notifications = repository.getNotifications(page, size);
                var list = Arguments.createArray();
                for (Notification notification : notifications) {
                    var map = Arguments.createMap();
                    map.putString("id", notification.getId());
                    map.putString("link", notification.getLink());
                    map.putString("message", notification.getMessage());
                    map.putBoolean("isRead", notification.isRead());
                    map.putString("createdAt", notification.getCreatedAt());
                    list.pushMap(map);
                }
                promise.resolve(list);
            } catch (Exception e) {
                promise.reject("GET_NOTIFICATIONS_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void markAsRead(final String notificationId, final Promise promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này");
            return;
        }

        executorService.execute(() -> {
            try {
                var success = repository.markAsRead(notificationId);
                promise.resolve(success);
            } catch (Exception e) {
                promise.reject("MARK_READ_ERROR", e.getMessage(), e);
            }
        });
    }
}

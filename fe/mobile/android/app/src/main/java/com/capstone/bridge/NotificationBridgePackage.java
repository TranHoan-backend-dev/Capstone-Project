package com.capstone.bridge;

import com.capstone.domain.repository.NotificationRepository;
import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.ReactPackage;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class NotificationBridgePackage implements ReactPackage {
    private final NotificationRepository repository;
    private final PermissionManager permissionManager;

    public NotificationBridgePackage(NotificationRepository repository, PermissionManager permissionManager) {
        this.repository = repository;
        this.permissionManager = permissionManager;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new NotificationBridgeModule(reactContext, repository, permissionManager));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

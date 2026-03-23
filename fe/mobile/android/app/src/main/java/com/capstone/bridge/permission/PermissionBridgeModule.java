package com.capstone.bridge.permission;

import androidx.annotation.NonNull;

import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PermissionBridgeModule extends ReactContextBaseJavaModule {
    private final PermissionManager permissionManager;

    public PermissionBridgeModule(ReactApplicationContext reactContext, PermissionManager permissionManager) {
        super(reactContext);
        this.permissionManager = permissionManager;
    }

    @Override
    public String getName() {
        return "PermissionModule";
    }

    @ReactMethod
    public void canAccessFullFeatures(@NonNull Promise promise) {
        promise.resolve(permissionManager.canAccessFullFeatures());
    }

    @ReactMethod
    public void canAccessModule(String moduleName, @NonNull Promise promise) {
        promise.resolve(permissionManager.canAccessModule(moduleName));
    }
}

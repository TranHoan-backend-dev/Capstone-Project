package com.capstone.bridge;

import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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
    public void canAccessFullFeatures(Promise promise) {
        promise.resolve(permissionManager.canAccessFullFeatures());
    }

    @ReactMethod
    public void canAccessModule(String moduleName, Promise promise) {
        promise.resolve(permissionManager.canAccessModule(moduleName));
    }
}

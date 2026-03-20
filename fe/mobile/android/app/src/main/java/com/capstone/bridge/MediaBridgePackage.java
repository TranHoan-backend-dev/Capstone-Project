package com.capstone.bridge;

import com.capstone.domain.repository.MediaRepository;
import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactPackage;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MediaBridgePackage implements ReactPackage {
    private final MediaRepository mediaRepository;
    private final PermissionManager permissionManager;

    public MediaBridgePackage(MediaRepository mediaRepository, PermissionManager permissionManager) {
        this.mediaRepository = mediaRepository;
        this.permissionManager = permissionManager;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MediaBridgeModule(reactContext, mediaRepository, permissionManager));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

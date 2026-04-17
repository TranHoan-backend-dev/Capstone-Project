package com.capstone.nawaco.bridge.media;

import androidx.annotation.NonNull;

import com.capstone.nawaco.domain.repository.MediaRepository;
import com.capstone.nawaco.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.ReactPackage;
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

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MediaBridgeModule(reactContext, mediaRepository, permissionManager));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

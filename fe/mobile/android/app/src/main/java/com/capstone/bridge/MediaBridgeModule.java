package com.capstone.bridge;

import com.capstone.domain.repository.MediaRepository;
import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.*;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MediaBridgeModule extends ReactContextBaseJavaModule {
    private final MediaRepository mediaRepository;
    private final PermissionManager permissionManager;
    private final ExecutorService executorService;

    public MediaBridgeModule(ReactApplicationContext reactContext, 
                             MediaRepository mediaRepository, 
                             PermissionManager permissionManager) {
        super(reactContext);
        this.mediaRepository = mediaRepository;
        this.permissionManager = permissionManager;
        this.executorService = Executors.newFixedThreadPool(4);
    }

    @Override
    public String getName() {
        return "MediaModule";
    }

    @ReactMethod
    public void uploadCapturedImage(final String filePath, final Promise promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này");
            return;
        }

        executorService.execute(() -> {
            try {
                File file = new File(filePath);
                if (!file.exists()) {
                    promise.reject("FILE_NOT_FOUND", "File at path " + filePath + " does not exist");
                    return;
                }
                String resultUrl = mediaRepository.processCapturedImage(file);
                promise.resolve(resultUrl);
            } catch (Exception e) {
                promise.reject("UPLOAD_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void performOcr(final String imageUrl, final Promise promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này");
            return;
        }

        executorService.execute(() -> {
            try {
                String ocrResult = mediaRepository.performOcr(imageUrl);
                promise.resolve(ocrResult);
            } catch (Exception e) {
                promise.reject("OCR_ERROR", e.getMessage(), e);
            }
        });
    }
}

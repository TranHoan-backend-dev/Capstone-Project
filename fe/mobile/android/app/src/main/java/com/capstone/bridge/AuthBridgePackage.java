package com.capstone.bridge;

import android.view.View;
import com.capstone.domain.repository.AuthRepository;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class AuthBridgePackage implements ReactPackage {
    private final AuthRepository authRepository;

    public AuthBridgePackage(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new AuthBridgeModule(reactContext, authRepository));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

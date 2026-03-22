package com.capstone.bridge.payment;

import com.capstone.domain.repository.PaymentRepository;
import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.ReactPackage;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PaymentBridgePackage implements ReactPackage {
    private final PaymentRepository paymentRepository;
    private final PermissionManager permissionManager;

    public PaymentBridgePackage(PaymentRepository paymentRepository, PermissionManager permissionManager) {
        this.paymentRepository = paymentRepository;
        this.permissionManager = permissionManager;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new PaymentBridgeModule(reactContext, paymentRepository, permissionManager));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

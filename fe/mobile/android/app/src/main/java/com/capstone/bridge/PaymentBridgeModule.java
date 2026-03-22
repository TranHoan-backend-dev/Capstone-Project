package com.capstone.bridge;

import com.capstone.domain.model.PaymentInfo;
import com.capstone.domain.repository.PaymentRepository;
import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class PaymentBridgeModule extends ReactContextBaseJavaModule {
    private final PaymentRepository paymentRepository;
    private final PermissionManager permissionManager;
    private final ExecutorService executorService;

    public PaymentBridgeModule(ReactApplicationContext reactContext, 
                               PaymentRepository paymentRepository, 
                               PermissionManager permissionManager) {
        super(reactContext);
        this.paymentRepository = paymentRepository;
        this.permissionManager = permissionManager;
        this.executorService = Executors.newFixedThreadPool(4);
    }

    @Override
    public String getName() {
        return "PaymentModule";
    }

    @ReactMethod
    public void getPayments(final Promise promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này");
            return;
        }

        executorService.execute(() -> {
            try {
                List<PaymentInfo> payments = paymentRepository.getPayments();
                WritableArray list = Arguments.createArray();
                for (PaymentInfo payment : payments) {
                    WritableMap map = Arguments.createMap();
                    map.putString("id", payment.getId());
                    map.putDouble("amount", payment.getAmount());
                    map.putString("paymentDate", payment.getPaymentDate());
                    map.putBoolean("isPaid", payment.isPaid());
                    map.putString("paymentMethod", payment.getPaymentMethod());
                    map.putString("description", payment.getDescription() != null ? payment.getDescription() : "");
                    list.pushMap(map);
                }
                promise.resolve(list);
            } catch (Exception e) {
                promise.reject("GET_PAYMENTS_ERROR", e.getMessage(), e);
            }
        });
    }
}

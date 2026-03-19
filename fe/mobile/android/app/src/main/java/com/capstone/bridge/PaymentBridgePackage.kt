package com.capstone.bridge

import com.capstone.domain.repository.PaymentRepository
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.capstone.infrastructure.security.PermissionManager

class PaymentBridgePackage(
    private val paymentRepository: PaymentRepository,
    private val permissionManager: PermissionManager
) : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(PaymentBridgeModule(reactContext, paymentRepository, permissionManager))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}

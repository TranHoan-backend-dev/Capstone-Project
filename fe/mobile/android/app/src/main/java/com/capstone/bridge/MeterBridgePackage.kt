package com.capstone.bridge

import com.capstone.domain.repository.MeterRepository
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.capstone.infrastructure.security.PermissionManager

class MeterBridgePackage(
    private val meterRepository: MeterRepository,
    private val permissionManager: PermissionManager
) : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(MeterBridgeModule(reactContext, meterRepository, permissionManager))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}

package com.capstone.common.app

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          val authRepository = EntryPointAccessors.fromApplication(
            this@MainApplication,
            AuthEntryPoint::class.java
          ).authRepository()
          add(AuthBridgePackage(authRepository))

          val mediaRepository = EntryPointAccessors.fromApplication(
            this@MainApplication,
            MediaEntryPoint::class.java
          ).mediaRepository()

          val permissionManager = EntryPointAccessors.fromApplication(
            this@MainApplication,
            PermissionEntryPoint::class.java
          ).permissionManager()

          add(MediaBridgePackage(mediaRepository, permissionManager))

          val notificationRepository = EntryPointAccessors.fromApplication(
            this@MainApplication,
            NotificationEntryPoint::class.java
          ).notificationRepository()
          add(NotificationBridgePackage(notificationRepository, permissionManager))

          add(com.capstone.bridge.PermissionBridgePackage(permissionManager))
        },
    )
  }

  @EntryPoint
  @InstallIn(SingletonComponent::class)
  interface AuthEntryPoint {
    fun authRepository(): AuthRepository
  }

  @EntryPoint
  @InstallIn(SingletonComponent::class)
  interface MediaEntryPoint {
    fun mediaRepository(): MediaRepository
  }

  @EntryPoint
  @InstallIn(SingletonComponent::class)
  interface NotificationEntryPoint {
    fun notificationRepository(): NotificationRepository
  }

  @EntryPoint
  @InstallIn(SingletonComponent::class)
  interface PermissionEntryPoint {
    fun permissionManager(): com.capstone.infrastructure.security.PermissionManager
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}

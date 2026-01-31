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
          val authRepository = dagger.hilt.android.EntryPointAccessors.fromApplication(
            this@MainApplication,
            AuthEntryPoint::class.java
          ).authRepository()
          add(com.capstone.bridge.AuthBridgePackage(authRepository))

          val mediaRepository = dagger.hilt.android.EntryPointAccessors.fromApplication(
            this@MainApplication,
            MediaEntryPoint::class.java
          ).mediaRepository()
          add(com.capstone.bridge.MediaBridgePackage(mediaRepository))
        },
    )
  }

  @EntryPoint
  @InstallIn(SingletonComponent::class)
  interface AuthEntryPoint {
    fun authRepository(): com.capstone.domain.repository.AuthRepository
  }

  @EntryPoint
  @InstallIn(SingletonComponent::class)
  interface MediaEntryPoint {
    fun mediaRepository(): com.capstone.domain.repository.MediaRepository
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}

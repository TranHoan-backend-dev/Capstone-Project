package com.capstone.common.app;

import android.app.Application;
import com.capstone.bridge.*;
import com.capstone.domain.repository.*;
import com.capstone.infrastructure.security.PermissionManager;
import com.capstone.BuildConfig;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.defaults.DefaultReactHost;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.ReactNativeApplicationEntryPoint;
import dagger.hilt.EntryPoint;
import dagger.hilt.InstallIn;
import dagger.hilt.android.EntryPointAccessors;
import dagger.hilt.android.HiltAndroidApp;
import dagger.hilt.components.SingletonComponent;

import java.util.List;

@HiltAndroidApp
public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public List<ReactPackage> getPackages() {
          return MainApplication.this.getPackages();
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

    private ReactHost reactHost;

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public ReactHost getReactHost() {
        if (reactHost == null) {
            reactHost = DefaultReactHost.getDefaultReactHost(
                this.getApplicationContext(),
                mReactNativeHost,
                null
            );
        }
        return reactHost;
    }

    private List<ReactPackage> getPackages() {
        List<ReactPackage> packages = new PackageList(this).getPackages();

        // Register custom bridge packages and inject their dependencies using Hilt EntryPoints
        AuthRepository authRepository = EntryPointAccessors.fromApplication(this, AuthEntryPoint.class).authRepository();
        packages.add(new AuthBridgePackage(authRepository));

        MediaRepository mediaRepository = EntryPointAccessors.fromApplication(this, MediaEntryPoint.class).mediaRepository();
        PermissionManager permissionManager = EntryPointAccessors.fromApplication(this, PermissionEntryPoint.class).permissionManager();
        packages.add(new MediaBridgePackage(mediaRepository, permissionManager));

        NotificationRepository notificationRepository = EntryPointAccessors.fromApplication(this, NotificationEntryPoint.class).notificationRepository();
        packages.add(new NotificationBridgePackage(notificationRepository, permissionManager));

        packages.add(new PermissionBridgePackage(permissionManager));

        PaymentRepository paymentRepository = EntryPointAccessors.fromApplication(this, PaymentEntryPoint.class).paymentRepository();
        packages.add(new PaymentBridgePackage(paymentRepository, permissionManager));

        MeterRepository meterRepository = EntryPointAccessors.fromApplication(this, MeterEntryPoint.class).meterRepository();
        packages.add(new MeterBridgePackage(meterRepository, permissionManager));

        return packages;
    }

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    public interface AuthEntryPoint {
        AuthRepository authRepository();
    }

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    public interface MediaEntryPoint {
        MediaRepository mediaRepository();
    }

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    public interface NotificationEntryPoint {
        NotificationRepository notificationRepository();
    }

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    public interface PermissionEntryPoint {
        PermissionManager permissionManager();
    }

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    public interface PaymentEntryPoint {
        PaymentRepository paymentRepository();
    }

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    public interface MeterEntryPoint {
        MeterRepository meterRepository();
    }

    @Override
    public void onCreate() {
        super.onCreate();
        ReactNativeApplicationEntryPoint.loadReactNative(this);
    }
}

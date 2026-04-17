package com.capstone.ui.views;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;

import java.util.Objects;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "CMSN";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
                this,
                Objects.requireNonNull(getMainComponentName()),
                DefaultNewArchitectureEntryPoint.getFabricEnabled()
        );
    }
}

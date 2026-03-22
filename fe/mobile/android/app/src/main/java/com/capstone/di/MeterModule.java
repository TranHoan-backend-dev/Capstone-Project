package com.capstone.di;

import android.content.Context;
import com.capstone.data.repository.MeterRepositoryImpl;
import com.capstone.domain.repository.MeterRepository;
import com.capstone.infrastructure.meter.MeterCaptureManager;
import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.android.qualifiers.ApplicationContext;
import dagger.hilt.components.SingletonComponent;

import javax.inject.Singleton;

/**
 * Dagger Module cấu hình các dịch vụ nhận diện và quản lý chỉ số đồng hồ.
 */
@Module
@InstallIn(SingletonComponent.class)
public class MeterModule {

    @Provides
    @Singleton
    public MeterCaptureManager provideMeterCaptureManager(@ApplicationContext Context context) {
        return new MeterCaptureManager(context);
    }

    @Provides
    @Singleton
    public MeterRepository provideMeterRepository(MeterCaptureManager captureManager) {
        return new MeterRepositoryImpl(captureManager);
    }
}

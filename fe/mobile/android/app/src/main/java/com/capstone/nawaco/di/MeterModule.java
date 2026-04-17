package com.capstone.nawaco.di;

import com.capstone.nawaco.data.repository.MeterRepositoryImpl;
import com.capstone.nawaco.domain.repository.MeterRepository;
import com.capstone.nawaco.infrastructure.meter.MeterCaptureManager;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
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
    public MeterCaptureManager provideMeterCaptureManager() {
        return new MeterCaptureManager();
    }

    @Provides
    @Singleton
    public MeterRepository provideMeterRepository(MeterCaptureManager captureManager) {
        return new MeterRepositoryImpl(captureManager);
    }
}

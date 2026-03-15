package com.capstone.di

import android.content.Context
import com.capstone.data.repository.MeterRepositoryImpl
import com.capstone.domain.repository.MeterRepository
import com.capstone.infrastructure.meter.MeterCaptureManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object MeterModule {

    @Provides
    @Singleton
    fun provideMeterCaptureManager(@ApplicationContext context: Context): MeterCaptureManager {
        return MeterCaptureManager(context)
    }

    @Provides
    @Singleton
    fun provideMeterRepository(captureManager: MeterCaptureManager): MeterRepository {
        return MeterRepositoryImpl(captureManager)
    }
}

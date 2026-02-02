package com.capstone.di

import com.capstone.data.repository.NotificationRepositoryImpl
import com.capstone.data.source.remote.NotificationApi
import com.capstone.domain.repository.NotificationRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NotificationModule {

    @Provides
    @Singleton
    fun provideNotificationApi(retrofit: Retrofit): NotificationApi {
        return retrofit.create(NotificationApi::class.java)
    }

    @Provides
    @Singleton
    fun provideNotificationRepository(api: NotificationApi): NotificationRepository {
        return NotificationRepositoryImpl(api)
    }
}

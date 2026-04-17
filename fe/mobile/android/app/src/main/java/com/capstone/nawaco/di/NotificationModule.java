package com.capstone.nawaco.di;

import com.capstone.nawaco.data.repository.NotificationRepositoryImpl;
import com.capstone.nawaco.data.source.remote.NotificationApi;
import com.capstone.nawaco.domain.repository.NotificationRepository;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import retrofit2.Retrofit;

import javax.inject.Singleton;

/**
 * Dagger Module cấu hình các dịch vụ thông báo (Notification).
 */
@Module
@InstallIn(SingletonComponent.class)
public class NotificationModule {

    @Provides
    @Singleton
    public NotificationApi provideNotificationApi(Retrofit retrofit) {
        return retrofit.create(NotificationApi.class);
    }

    @Provides
    @Singleton
    public NotificationRepository provideNotificationRepository(NotificationApi api) {
        return new NotificationRepositoryImpl(api);
    }
}

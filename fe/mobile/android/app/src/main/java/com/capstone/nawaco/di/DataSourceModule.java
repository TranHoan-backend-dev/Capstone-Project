package com.capstone.nawaco.di;

import com.capstone.nawaco.data.datasource.AuthRemoteDataSource;
import com.capstone.nawaco.data.source.remote.AuthApi;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;

import javax.inject.Singleton;

/**
 * Dagger Module cấu hình các thành phần cung cấp dữ liệu cho ứng dụng.
 */
@Module
@InstallIn(SingletonComponent.class)
public class DataSourceModule {

    @Provides
    @Singleton
    public AuthRemoteDataSource provideAuthRemoteDataSource(AuthApi api) {
        return new AuthRemoteDataSource(api);
    }
}

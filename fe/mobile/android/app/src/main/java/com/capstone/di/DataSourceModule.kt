package com.capstone.di

import com.capstone.data.datasource.AuthRemoteDataSource
import com.capstone.data.source.remote.AuthApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DataSourceModule {

    @Provides
    @Singleton
    fun provideAuthRemoteDataSource(api: AuthApi): AuthRemoteDataSource {
        return AuthRemoteDataSource(api)
    }
}

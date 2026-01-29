package com.capstone.di

import com.capstone.data.datasource.boundary.SampleRemoteDataSource
import com.capstone.data.datasource.impl.SampleRemoteDataSourceImpl
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class DataSourceModule {

    @Binds
    @Singleton
    abstract fun bindSampleRemoteDataSource(
        sampleRemoteDataSourceImpl: SampleRemoteDataSourceImpl
    ): SampleRemoteDataSource
}

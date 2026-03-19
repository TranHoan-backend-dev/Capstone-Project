package com.capstone.di

import com.capstone.data.repository.PaymentRepositoryImpl
import com.capstone.data.source.remote.PaymentApi
import com.capstone.domain.repository.PaymentRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object PaymentModule {

    @Provides
    @Singleton
    fun providePaymentApi(retrofit: Retrofit): PaymentApi {
        return retrofit.create(PaymentApi::class.java)
    }

    @Provides
    @Singleton
    fun providePaymentRepository(api: PaymentApi): PaymentRepository {
        return PaymentRepositoryImpl(api)
    }
}

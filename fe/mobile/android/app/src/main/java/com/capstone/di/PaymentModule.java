package com.capstone.di;

import com.capstone.data.repository.PaymentRepositoryImpl;
import com.capstone.data.source.remote.PaymentApi;
import com.capstone.domain.repository.PaymentRepository;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import retrofit2.Retrofit;

import javax.inject.Singleton;

/**
 * Dagger Module cấu hình các dịch vụ thanh toán (Payment).
 */
@Module
@InstallIn(SingletonComponent.class)
public class PaymentModule {

    @Provides
    @Singleton
    public PaymentApi providePaymentApi(Retrofit retrofit) {
        return retrofit.create(PaymentApi.class);
    }

    @Provides
    @Singleton
    public PaymentRepository providePaymentRepository(PaymentApi api) {
        return new PaymentRepositoryImpl(api);
    }
}

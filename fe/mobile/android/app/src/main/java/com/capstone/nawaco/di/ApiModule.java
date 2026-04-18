package com.capstone.nawaco.di;

import androidx.annotation.NonNull;

import com.capstone.nawaco.common.utils.Constants;
import com.capstone.nawaco.data.source.remote.AuthApi;
import com.capstone.nawaco.infrastructure.security.AuthInterceptor;
import com.capstone.nawaco.infrastructure.security.SecurityFilterInterceptor;
import com.capstone.nawaco.infrastructure.security.TokenAuthenticator;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import javax.inject.Singleton;

/**
 * Dagger Module cấu hình các thành phần liên quan đến Network (Retrofit, OkHttp).
 */
@Module
@InstallIn(SingletonComponent.class)
public class ApiModule {

    @Provides
    @Singleton
    public HttpLoggingInterceptor provideLoggingInterceptor() {
        var interceptor = new HttpLoggingInterceptor();
        interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        return interceptor;
    }

    @Provides
    @Singleton
    public OkHttpClient provideOkHttpClient(
            HttpLoggingInterceptor loggingInterceptor,
            AuthInterceptor authInterceptor,
            SecurityFilterInterceptor securityFilterInterceptor,
            TokenAuthenticator authenticator
    ) {
        return new OkHttpClient.Builder()
                .addInterceptor(securityFilterInterceptor) // Lớp bảo vệ vòng ngoài (Rate limit, Common headers)
                .addInterceptor(authInterceptor)           // Lớp tự động gán token và logic Auth
                .addInterceptor(loggingInterceptor)        // Lớp logging phục vụ debug
                .authenticator(authenticator)              // Xử lý tự động Refresh Token khi lỗi 401
                .build();
    }

    @Provides
    @Singleton
    public Retrofit provideRetrofit(OkHttpClient okHttpClient) {
        return new Retrofit.Builder()
                .baseUrl(Constants.BASE_URL)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    @Provides
    @Singleton
    public AuthApi provideAuthApi(@NonNull Retrofit retrofit) {
        return retrofit.create(AuthApi.class);
    }
}

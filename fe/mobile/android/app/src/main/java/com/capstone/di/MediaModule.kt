package com.capstone.di

import com.capstone.data.repository.MediaRepositoryImpl
import com.capstone.data.source.remote.GoogleCloudUploader
import com.capstone.data.source.remote.MediaApi
import com.capstone.domain.repository.MediaRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object MediaModule {

    @Provides
    @Singleton
    fun provideMediaApi(retrofit: Retrofit): MediaApi {
        return retrofit.create(MediaApi::class.java)
    }

    @Provides
    @Singleton
    fun provideGoogleCloudUploader(okHttpClient: OkHttpClient): GoogleCloudUploader {
        return GoogleCloudUploader(okHttpClient, "YOUR_SIMULATED_API_KEY")
    }

    @Provides
    @Singleton
    fun provideMediaRepository(
        mediaApi: MediaApi,
        gcsUploader: GoogleCloudUploader
    ): MediaRepository {
        return MediaRepositoryImpl(mediaApi, gcsUploader)
    }
}

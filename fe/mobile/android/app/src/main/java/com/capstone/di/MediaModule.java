package com.capstone.di;

import com.capstone.data.repository.MediaRepositoryImpl;
import com.capstone.data.source.remote.GoogleCloudUploader;
import com.capstone.data.source.remote.MediaApi;
import com.capstone.domain.repository.MediaRepository;
import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;

import javax.inject.Singleton;

/**
 * Dagger Module liên kết các thành phần liên quan đến Media (ảnh, OCR).
 */
@Module
@InstallIn(SingletonComponent.class)
public class MediaModule {

    @Provides
    @Singleton
    public MediaApi provideMediaApi(Retrofit retrofit) {
        return retrofit.create(MediaApi.class);
    }

    @Provides
    @Singleton
    public GoogleCloudUploader provideGoogleCloudUploader(OkHttpClient okHttpClient) {
        // Cung cấp API Key cho Google Cloud
        return new GoogleCloudUploader(okHttpClient, "YOUR_SIMULATED_API_KEY");
    }

    @Provides
    @Singleton
    public MediaRepository provideMediaRepository(
        MediaApi mediaApi,
        GoogleCloudUploader gcsUploader
    ) {
        return new MediaRepositoryImpl(mediaApi, gcsUploader);
    }
}

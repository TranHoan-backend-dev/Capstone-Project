package com.capstone.nawaco.di;

import com.capstone.nawaco.data.datasource.AuthRemoteDataSource;
import com.capstone.nawaco.data.repository.AuthRepositoryImpl;
import com.capstone.nawaco.domain.repository.AuthRepository;
import com.capstone.nawaco.infrastructure.security.AntiBruteForceManager;
import com.capstone.nawaco.infrastructure.security.TokenManager;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;

import javax.inject.Singleton;

/**
 * Dagger Module liên kết các interface Repository với lớp triển khai cụ thể (Impl).
 */
@Module
@InstallIn(SingletonComponent.class)
public class RepositoryModule {

    @Provides
    @Singleton
    public AuthRepository provideAuthRepository(
            AuthRemoteDataSource remote,
            TokenManager tokenManager,
            AntiBruteForceManager bruteForceManager
    ) {
        return new AuthRepositoryImpl(remote, tokenManager, bruteForceManager);
    }
}

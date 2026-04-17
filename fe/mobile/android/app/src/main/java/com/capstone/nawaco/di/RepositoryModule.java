package com.capstone.di;

import com.capstone.data.datasource.AuthRemoteDataSource;
import com.capstone.data.repository.AuthRepositoryImpl;
import com.capstone.domain.repository.AuthRepository;
import com.capstone.infrastructure.security.AntiBruteForceManager;
import com.capstone.infrastructure.security.TokenManager;

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
